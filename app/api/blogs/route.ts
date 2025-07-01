import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User'; // Import User model to ensure it's registered
import { ensureModelsRegistered } from '@/lib/models';
import { validateRequest, createBlogSchema } from '@/lib/validation';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// GET /api/blogs - Get all blog posts
async function getBlogsHandler(req: NextRequest) {
  try {
    await connectDB();
    // Ensure all models are registered
    ensureModelsRegistered();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const fields = searchParams.get('fields'); // For selective field fetching

    // Build query
    const query: any = {};
    const isAdmin = searchParams.get('admin') === 'true';

    // For admin access, allow all statuses; for public access, only show published posts
    if (status) {
      query.status = status;
    } else if (!isAdmin) {
      query.status = 'published'; // Default to published for public access
    }
    // If admin and no status specified, show all statuses

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build select fields based on request
    let selectFields = '';
    if (fields) {
      selectFields = fields.split(',').join(' ');
    }

    let query_builder = BlogPost.find(query);

    // Apply field selection if specified
    if (selectFields) {
      query_builder = query_builder.select(selectFields);
    }

    // Only populate if not using field selection or if createdBy is included
    // Also ensure User model is available before populating
    if (!fields || fields.includes('createdBy')) {
      try {
        // Ensure User model is registered
        if (User) {
          query_builder = query_builder.populate('createdBy', 'name email');
        }
      } catch (populateError) {
        console.warn('Warning: Could not populate createdBy field:', populateError);
        // Continue without population
      }
    }

    const blogs = await query_builder
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform data to include featuredImage for frontend compatibility
    const transformedBlogs = blogs.map(blog => {
      const transformed: any = {
        ...blog,
        featuredImage: blog.coverImage // Add featuredImage field for frontend compatibility
      };

      // If this is for sitemap (fields specified), reduce content size
      if (fields && !fields.includes('content') && transformed.content) {
        delete transformed.content;
      }

      return transformed;
    });

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);

    const response = NextResponse.json({
      success: true,
      data: transformedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;

  } catch (error) {
    console.error('Get blogs error:', error);

    // More detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog post (admin only)
async function createBlogHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body, createBlogSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get user ID from authenticated request
    if (!req.user || !req.user.userId) {
      return NextResponse.json(
        { error: 'User authentication required' },
        { status: 401 }
      );
    }

    const userId = req.user.userId;

    // Generate slug from title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    // Type assertion for validation.value
    const validatedData = validation.value as {
      title: string;
      excerpt: string;
      content: string;
      coverImage?: string;
      author: {
        name: string;
        avatar?: string;
      };
      category: string;
      tags: string[];
      status: 'draft' | 'published' | 'archived' | 'scheduled';
      readingTime?: number;
      seoMeta?: {
        title?: string;
        description?: string;
        keywords?: string[];
      };
      publishDate?: string | Date;
      publishedAt?: Date;
    };

    // Handle publishDate conversion to publishedAt
    let publishedAt: Date | undefined;
    if (validatedData.status === 'published') {
      publishedAt = new Date();
    } else if (validatedData.status === 'scheduled' && validatedData.publishDate) {
      publishedAt = new Date(validatedData.publishDate);
    } else if (validatedData.publishedAt) {
      publishedAt = new Date(validatedData.publishedAt);
    }

    const blogData = {
      ...validatedData,
      slug: generateSlug(validatedData.title),
      createdBy: userId,
      publishedAt,
      // Remove publishDate as it's not part of the schema
      publishDate: undefined
    };

    const blog = await BlogPost.create(blogData);

    // Populate the created blog
    await blog.populate('createdBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A blog post with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

// Export the handlers
export async function GET(req: NextRequest) {
  return getBlogsHandler(req);
}

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createBlogHandler);
