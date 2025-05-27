import { useRef, useEffect } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from "ogl";

type GL = Renderer["gl"];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = "bold 30px monospace",
  color: string = "black",
  backgroundColor: string | null = null,
  maxWidth: number | null = null,
  padding: number = 10,
  isDescription: boolean = false
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2d context");

  context.font = font;
  const lines: string[] = [];
  let currentLine = "";

  if (maxWidth && maxWidth > 0) {
    const words = text.split(" ");
    for (const word of words) {
      const testLine = currentLine + (currentLine === "" ? "" : " ") + word;
      const metricsTest = context.measureText(testLine);
      if (metricsTest.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
  } else {
    lines.push(text);
  }

  const fontSize = getFontSize(font);
  const lineHeight = fontSize * 1.2;
  const textBlockHeight = lines.length * lineHeight;

  let calculatedTextWidth = 0;
  for (const line of lines) {
    const metrics = context.measureText(line);
    if (metrics.width > calculatedTextWidth) {
      calculatedTextWidth = metrics.width;
    }
  }
  
  canvas.width = Math.ceil(calculatedTextWidth) + padding * 2;
  canvas.height = Math.ceil(textBlockHeight) + padding * 2;

  context.font = font;
  if (backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  context.fillStyle = color;

  if (isDescription) {
    context.textAlign = "left";
    let y = padding + fontSize;
    for (const line of lines) {
      context.fillText(line, padding, y);
      y += lineHeight;
    }
  } else {
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(lines.join(" "), canvas.width / 2, canvas.height / 2);
  }

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  font?: string;
  textColor?: string;
  backgroundColor?: string | null;
  maxWidth?: number | null;
  isDescription?: boolean;
}

class TextMesh {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  font: string;
  textColor: string;
  backgroundColor: string | null;
  maxWidth: number | null;
  isDescription: boolean;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    font = "30px sans-serif",
    textColor = "#545050",
    backgroundColor = null,
    maxWidth = null,
    isDescription = false,
  }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.font = font;
    this.textColor = textColor;
    this.backgroundColor = backgroundColor;
    this.maxWidth = maxWidth;
    this.isDescription = isDescription;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
      this.backgroundColor,
      this.maxWidth,
      this.isDescription ? 8 : 10,
      this.isDescription
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    
    const aspect = width / height;
    let textHeightScaled, textWidthScaled;

    if (this.isDescription) {
      textWidthScaled = this.plane.scale.x * 0.85;
      textHeightScaled = textWidthScaled / aspect;
      this.mesh.position.y = -this.plane.scale.y * 0.5 + textHeightScaled * 0.5 + this.plane.scale.y * 0.05;
    } else {
      textHeightScaled = this.plane.scale.y * 0.12;
      textWidthScaled = textHeightScaled / aspect;
      this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - this.plane.scale.y * 0.08;
    }
    
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.setParent(this.plane);
    this.mesh.visible = !this.isDescription;
  }

  updateText(newText: string) {
    this.text = newText;
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor,
      this.backgroundColor,
      this.maxWidth,
      this.isDescription ? 8 : 10,
      this.isDescription
    );
    (this.mesh.program.uniforms.tMap.value as Texture).image = texture.image;
    (this.mesh.program.uniforms.tMap.value as Texture).needsUpdate = true;
    
    const aspect = width / height;
    let textHeightScaled, textWidthScaled;
    if (this.isDescription) {
      textWidthScaled = this.plane.scale.x * 0.85;
      textHeightScaled = textWidthScaled / aspect;
    } else {
      textHeightScaled = this.plane.scale.y * 0.12;
      textWidthScaled = textHeightScaled / aspect;
    }
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
  }

  setVisibility(visible: boolean) {
    this.mesh.visible = visible;
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  fullDescription: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  fullDescription: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  titleMesh!: TextMesh;
  descriptionMesh!: TextMesh;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  isHovered: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    fullDescription,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.fullDescription = fullDescription;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    autoBind(this);
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.createDescription();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.titleMesh = new TextMesh({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
      isDescription: false,
      maxWidth: null,
    });
  }

  createDescription() {
    this.descriptionMesh = new TextMesh({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.fullDescription,
      font: "normal 17px sans-serif",
      textColor: "#FFFFFF",
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      isDescription: true,
      maxWidth: 280,
    });
  }

  update(
    scroll: { current: number; last: number },
    direction: "right" | "left"
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    
    const distFromCenter = Math.abs(this.plane.position.x);
    const activationThreshold = this.plane.scale.x * 0.5;

    if (distFromCenter < activationThreshold) {
      if (!this.isHovered) {
        this.isHovered = true;
        this.descriptionMesh.setVisibility(true);
      }
    } else {
      if (this.isHovered) {
        this.isHovered = false;
        this.descriptionMesh.setVisibility(false);
      }
    }
  }

  onResize({
    screen,
    viewport,
  }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;

    if (this.titleMesh) {
      this.titleMesh.updateText(this.titleMesh.text);
    }
    if (this.descriptionMesh) {
      this.descriptionMesh.updateText(this.descriptionMesh.text);
    }
  }
}

interface AppConfig {
  items?: { image: string; text: string; fullDescription: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
}

class App {
  container: HTMLElement;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string; fullDescription: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;

  boundOnResize!: () => void;
  boundOnWheel!: () => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  isDown: boolean = false;
  start: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px DM Sans",
    }: AppConfig
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: { image: string; text: string; fullDescription: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems = [
      {
        image: `https://picsum.photos/seed/1/800/600?grayscale`,
        text: "Bridge",
        fullDescription: "A stunning grayscale bridge leading to unknown adventures.",
      },
      {
        image: `https://picsum.photos/seed/2/800/600?grayscale`,
        text: "Desk Setup",
        fullDescription: "A detailed view of a desk setup with a computer and books.",
      },
      {
        image: `https://picsum.photos/seed/3/800/600?grayscale`,
        text: "Waterfall",
        fullDescription: "A beautiful waterfall surrounded by lush greenery.",
      },
      {
        image: `https://picsum.photos/seed/4/800/600?grayscale`,
        text: "Strawberries",
        fullDescription: "Fresh strawberries ripe for the picking.",
      },
      {
        image: `https://picsum.photos/seed/5/800/600?grayscale`,
        text: "Deep Diving",
        fullDescription: "A diver exploring the depths of the ocean.",
      },
      {
        image: `https://picsum.photos/seed/16/800/600?grayscale`,
        text: "Train Track",
        fullDescription: "A long train track stretching into the distance.",
      },
      {
        image: `https://picsum.photos/seed/17/800/600?grayscale`,
        text: "Santorini",
        fullDescription: "The beautiful Greek island of Santorini.",
      },
      {
        image: `https://picsum.photos/seed/8/800/600?grayscale`,
        text: "Blurry Lights",
        fullDescription: "A cityscape at night with blurry street lights.",
      },
      {
        image: `https://picsum.photos/seed/9/800/600?grayscale`,
        text: "New York",
        fullDescription: "The bustling city of New York at night.",
      },
      {
        image: `https://picsum.photos/seed/10/800/600?grayscale`,
        text: "Good Boy",
        fullDescription: "A happy dog enjoying a sunny day.",
      },
      {
        image: `https://picsum.photos/seed/21/800/600?grayscale`,
        text: "Coastline",
        fullDescription: "The serene coastline with rolling waves.",
      },
      {
        image: `https://picsum.photos/seed/12/800/600?grayscale`,
        text: "Palm Trees",
        fullDescription: "Relaxing view of palm trees against a gray sky.",
      },
    ];
    const galleryItems = items && items.length ? items : defaultItems.map(item => ({...item, fullDescription: item.fullDescription || item.text }));
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        fullDescription: data.fullDescription,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * 0.05;
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel() {
    this.scroll.target += 2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousewheel", this.boundOnWheel);
    window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousewheel", this.boundOnWheel);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas as HTMLCanvasElement
      );
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string; fullDescription: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans",
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font]);
  return <div
    className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
    ref={containerRef}
  />;
}
