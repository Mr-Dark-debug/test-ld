"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Dummy blog post data - replace with actual data fetching
const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Architecture in Urban Development",
    date: "October 26, 2023",
    excerpt: "Exploring innovative designs and materials that are shaping eco-friendly cityscapes. How green buildings contribute to a healthier planet and improved quality of life...",
    author: "AI Architect",
    category: "Architecture",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    slug: "the-future-of-sustainable-architecture-in-urban-development",
  },
  {
    id: 2,
    title: "Smart Homes: Integrating Technology for a Modern Lifestyle",
    date: "October 22, 2023",
    excerpt: "A look into how IoT devices, AI, and automation are transforming residential spaces, offering convenience, security, and energy efficiency...",
    author: "Tech Explorer",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1529400971027-cadd71752d99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    slug: "smart-homes-integrating-technology-for-a-modern-lifestyle",
  },
  {
    id: 3,
    title: "The Art of Interior Design: Creating Spaces That Inspire",
    date: "October 18, 2023",
    excerpt: "Principles of interior design that can turn any home into a sanctuary. From color palettes to furniture selection, discover how to craft personalized and inspiring environments.",
    author: "Design Maven",
    category: "Interior Design",
    imageUrl: "https://images.unsplash.com/photo-1600210492493-419465538468?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    slug: "the-art-of-interior-design-creating-spaces-that-inspire",
  },
   {
    id: 4,
    title: "Navigating the Real Estate Market: Tips for First-Time Buyers",
    date: "October 15, 2023",
    excerpt: "A comprehensive guide for those looking to purchase their first property. Understand market trends, financing options, and the key steps to a successful home purchase.",
    author: "Realty Expert",
    category: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    slug: "navigating-the-real-estate-market-tips-for-first-time-buyers",
  },
  {
    id: 5,
    title: "Community Living: The Benefits of Choosing a Well-Planned Residential Project",
    date: "October 10, 2023",
    excerpt: "More than just a home, modern residential projects offer a lifestyle. Discover the advantages of amenities, green spaces, and a strong community fabric.",
    author: "Urban Planner",
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    slug: "community-living-the-benefits-of-choosing-a-well-planned-residential-project",
  },
];

const BlogCard = ({ post }: { post: typeof blogPosts[0] & { slug: string } }) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href, // Or a specific URL for the blog post
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback for browsers that don\'t support navigator.share or if user cancels
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don\'t support navigator.share
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href); // Or specific post URL
    setIsShared(true); // Use the same state to indicate "Copied!"
    setTimeout(() => setIsShared(false), 2000);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {post.imageUrl && (
        <div className="relative w-full h-56">
          <img
            src={post.imageUrl}
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
          By {post.author} on {post.date}
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
            Stay updated with the latest news, trends, and insights from Laxmi Developers and the real estate world.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {blogPosts.length === 0 && (
             <div className="text-center py-12">
                <img src="/images/illustrations/empty-blog.svg" alt="No Posts Yet" className="mx-auto mb-6 h-48 w-auto"/>
                <h2 className="text-2xl font-semibold text-foreground/80 mb-2">No Posts Yet</h2>
                <p className="text-foreground/60">Check back soon for insightful articles and updates!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 