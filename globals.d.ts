// Extend the Next.js types
declare namespace JSX {
  interface IntrinsicElements {
    // Add any custom elements here if needed
  }
}

// Extend the PageProps interface for Next.js dynamic routes
declare module 'next' {
  interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
} 