"use client";

import React, { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { blogsApi } from "@/lib/api";

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

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/blogs/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: postUrl,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback for browsers that don\'t support navigator.share or if user cancels
        copyToClipboard(postUrl);
      }
    } else {
      // Fallback for browsers that don\'t support navigator.share
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsShared(true); // Use the same state to indicate "Copied!"
    setTimeout(() => setIsShared(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {post.featuredImage && (
        <div className="relative w-full h-56">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="object-cover w-full h-full"
          />
           <div className="absolute top-3 right-3 bg-gray-700/70 dark:bg-gray-600/70 text-white dark:text-gray-100 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
            {post.category}
          </div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/blogs/${post.slug}`} className="block mb-2 group">
          <h3 className="text-xl font-display text-foreground group-hover:text-highlight transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-foreground/60 mb-3">
          By {post.author.name} on {formatDate(post.publishedAt || post.createdAt)}
        </p>
        <p className="text-sm text-foreground/80 mb-4 flex-grow leading-relaxed">
          {post.excerpt}
        </p>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/60 dark:border-border-dark/60">
          <Link
            href={`/blogs/${post.slug}`}
            className="text-sm font-medium text-highlight dark:text-highlight-dark hover:underline"
          >
            Read More
          </Link>
          <button
            onClick={handleShare}
            className={cn(
              "p-2 rounded-full transition-all duration-300 ease-in-out text-foreground/70 dark:text-foreground-dark/70 hover:text-highlight dark:hover:text-highlight-dark",
              isShared ? "bg-green-500/20 text-green-500 dark:bg-green-400/20 dark:text-green-400" : "hover:bg-muted dark:hover:bg-muted-dark"
            )}
            title={isShared ? (navigator.share ? "Shared!" : "Link Copied!") : "Share Post"}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await blogsApi.getAll({
          status: 'published',
          limit: 20 // Reduced limit to prevent large responses
        });

        if (response.success && response.data) {
          setBlogPosts(response.data);
        } else {
          setError(response.error || 'Failed to fetch blogs');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    // Set up polling to check for new blog posts every 30 seconds
    const interval = setInterval(fetchBlogs, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 dark:from-muted-dark/30 to-background dark:to-background-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* Optional: subtle background pattern or image */}
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedTitle
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-display mb-4"
          >
            Insights & Stories
          </AnimatedTitle>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Welcome to the Laxmi Developers blog, your source for valuable insights, company news, and the latest trends in the real estate industry.
            Discover expert advice, learn about our community involvement, and explore the stories behind our innovative projects.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
              <p className="text-foreground/60">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Posts</h2>
              <p className="text-foreground/60 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
              {blogPosts.length === 0 && (
                <div className="text-center py-12">
                  <img src="/images/illustrations/empty-blog.svg" alt="No Posts Yet" className="mx-auto mb-6 h-48 w-auto"/>
                  <h2 className="text-2xl font-semibold text-foreground/80 mb-2">No Posts Yet</h2>
                  <p className="text-foreground/60">Check back soon for insightful articles and updates!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}