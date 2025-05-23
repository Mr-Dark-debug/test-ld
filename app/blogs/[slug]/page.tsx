"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import { Share2, ChevronLeft, Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Head from 'next/head';

// Sample blog post data (move to a separate file or API in production)
const allBlogPosts = [
  {
    id: 1,
    slug: "the-future-of-sustainable-architecture-in-urban-development",
    title: "The Future of Sustainable Architecture in Urban Development",
    date: "October 26, 2023",
    readingTime: "7 min read",
    excerpt:
      "Exploring innovative designs and materials that are shaping eco-friendly cityscapes...",
    author: "AI Architect",
    category: "Architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    content: `
## The Future of Sustainable Architecture in Urban Development

As cities continue to expand, the need for sustainable architecture has never been more urgent. Urban environments face unique challenges—ranging from resource scarcity to pollution and the heat island effect. The future of architecture lies in innovative, eco-friendly solutions that not only minimize environmental impact but also enhance the quality of urban life.

### Key Trends Shaping the Future

- **Green Roofs & Living Walls:**  
  Buildings are increasingly being designed with green roofs and living walls, which help regulate temperature, improve air quality, and provide habitats for urban wildlife.

- **Smart Building Technology:**  
  The integration of IoT devices and AI-driven systems allows buildings to optimize energy use, monitor air quality, and adapt to occupants' needs in real time.

- **Sustainable Materials:**  
  Architects are turning to recycled, renewable, and locally sourced materials. Innovations like cross-laminated timber and low-carbon concrete are reducing the carbon footprint of new construction.

- **Water Conservation:**  
  Rainwater harvesting, greywater recycling, and efficient plumbing systems are becoming standard features in sustainable urban buildings.

### Case Study: The Eco-Tower

One of the most exciting examples of sustainable urban architecture is the Eco-Tower, a high-rise that combines solar panels, wind turbines, and a rainwater collection system. Its façade is covered in vertical gardens, and its smart systems adjust lighting and HVAC based on occupancy and weather.

![Sustainable Building Design](https://images.unsplash.com/photo-1487700160041-bab79e9cb66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

### The Human Element

Sustainable architecture is not just about technology—it's about people. Designs that maximize natural light, provide access to green spaces, and encourage community interaction contribute to healthier, happier urban populations.

> "Sustainable development is the pathway to the future we want for all. It offers a framework to generate economic growth, achieve social justice, seek environmental protection and strengthen governance."  
> — Ban Ki-moon

### Looking Ahead

The future of sustainable architecture in urban development is bright. As technology advances and awareness grows, cities will become greener, smarter, and more livable. By embracing these trends, architects and developers can create urban spaces that are resilient, inclusive, and inspiring for generations to come.
    `,
  },
  // Add more posts as needed
];

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  author: string;
  category: string;
  imageUrl: string;
  content: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid post URL");
      return;
    }

    const foundPost = allBlogPosts.find((p) => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
      setError(null);
    } else {
      setError("Post not found");
    }
  }, [slug]);

  const handleShare = useCallback(async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setIsShared(true);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setIsShared(true);
      }
      setTimeout(() => setIsShared(false), 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      setError("Failed to share post");
      setTimeout(() => setError(null), 3000);
    }
  }, [post]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <div className="text-center">
          <AnimatedTitle as="h1" className="mb-4">
            {error}
          </AnimatedTitle>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center text-sm font-medium text-highlight dark:text-highlight-dark hover:underline"
          >
            <ChevronLeft size={18} className="mr-1" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <div className="text-center">
          <AnimatedTitle as="h1" className="mb-4">
            Loading Post...
          </AnimatedTitle>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted dark:bg-muted-dark rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted dark:bg-muted-dark rounded w-1/2 mx-auto"></div>
          </div>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center text-sm font-medium text-highlight dark:text-highlight-dark hover:underline"
          >
            <ChevronLeft size={18} className="mr-1" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark min-h-screen">
        <header
          className="relative py-24 md:py-40 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${post.imageUrl})`,
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <AnimatedTitle
              as="h1"
              className="text-3xl md:text-4xl lg:text-5xl font-display mb-4 text-white shadow-text"
            >
              {post.title}
            </AnimatedTitle>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-8">
              <span className="flex items-center">
                <User size={14} className="mr-1.5" aria-hidden="true" /> {post.author}
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1.5" aria-hidden="true" /> {post.date} (
                {post.readingTime})
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center">
                <Tag size={14} className="mr-1.5" aria-hidden="true" /> {post.category}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/blogs"
              className="inline-flex items-center text-sm font-medium text-highlight dark:text-highlight-dark hover:underline group"
              aria-label="Back to all blog posts"
            >
              <ChevronLeft
                size={18}
                className="mr-1 group-hover:-translate-x-1 transition-transform"
                aria-hidden="true"
              />
              Back to Blogs
            </Link>
            <button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg transition-all duration-300 ease-in-out text-sm font-medium",
                isShared
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-muted dark:bg-muted-dark hover:bg-muted/80 dark:hover:bg-muted-dark/80 text-foreground/70 dark:text-foreground-dark/70 hover:text-highlight dark:hover:text-highlight-dark"
              )}
              aria-label={isShared ? "Link copied or shared" : "Share this post"}
            >
              <Share2 size={16} aria-hidden="true" />
              <span>
                {isShared
                  ? (typeof navigator.share === "function" ? "Shared!" : "Copied!")
                  : "Share"}
              </span>
            </button>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-img:shadow-md prose-headings:font-display prose-a:text-highlight dark:prose-a:text-highlight-dark hover:prose-a:underline prose-blockquote:border-l-highlight dark:prose-blockquote:border-l-highlight-dark prose-blockquote:text-foreground/80 dark:prose-blockquote:text-foreground-dark/80">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <Image
                    src={typeof src === "string" ? src : ""}
                    alt={alt || 'Blog post image'}
                    width={1200}
                    height={800}
                    className="rounded-lg shadow-md"
                    loading="lazy"
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </>
  );
}