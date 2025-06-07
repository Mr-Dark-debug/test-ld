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
import { blogsApi } from '@/lib/api';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledFor?: string;
  readingTime?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) {
        setError("Invalid post URL");
        return;
      }

      try {
        setError(null);
        const response = await blogsApi.getBySlug(slug);

        if (response.success && response.data) {
          setPost(response.data);
        } else {
          setError("Post not found");
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError("Failed to load post");
      }
    };

    fetchBlogPost();
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
        <meta property="og:image" content={post.featuredImage || '/images/placeholder-project.jpg'} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark min-h-screen">
        <header
          className="relative py-24 md:py-40 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${post.featuredImage || '/images/placeholder-project.jpg'})`,
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <AnimatedTitle
              as="h1"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display mb-4 text-white shadow-text leading-tight break-words hyphens-auto max-w-5xl mx-auto"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
            >
              {post.title}
            </AnimatedTitle>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-8">
              <span className="flex items-center">
                <User size={14} className="mr-1.5" aria-hidden="true" /> {post.author.name}
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1.5" aria-hidden="true" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {post.readingTime && ` (${post.readingTime})`}
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
              type="button"
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

          <article className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-img:shadow-md prose-headings:font-display prose-a:text-highlight dark:prose-a:text-highlight-dark hover:prose-a:underline prose-blockquote:border-l-highlight dark:prose-blockquote:border-l-highlight-dark prose-blockquote:text-foreground/80 dark:prose-blockquote:text-foreground-dark/80 prose-p:leading-relaxed prose-p:mb-6 prose-li:mb-2 prose-ul:mb-6 prose-ol:mb-6 prose-h1:mb-8 prose-h2:mb-6 prose-h3:mb-4 prose-h4:mb-4 prose-h5:mb-3 prose-h6:mb-3 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <Image
                    src={typeof src === "string" ? src : ""}
                    alt={alt || 'Blog post image'}
                    width={1200}
                    height={800}
                    className="rounded-lg shadow-md my-8"
                    loading="lazy"
                  />
                ),
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mb-8 mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-semibold mb-6 mt-10 text-gray-900 dark:text-gray-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-2 text-lg leading-relaxed">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-highlight dark:border-highlight-dark pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-800 rounded-r-lg italic text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children }) => {
                  if (inline) {
                    return (
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-6">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8 border border-gray-700">
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700 dark:text-gray-300">
                    {children}
                  </em>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-highlight dark:text-highlight-dark hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
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