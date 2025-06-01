import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { validateRequest, createBlogSchema } from '@/lib/validation';

// GET /api/blogs - Get all blog posts
async function getBlogsHandler(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

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

    const blogs = await BlogPost.find(query)
      .populate('createdBy', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog post (admin only)
async function createBlogHandler(req: NextRequest) {
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

    // For now, we'll use a default user ID - in real implementation, get from auth
    const defaultUserId = '507f1f77bcf86cd799439011'; // This should come from authenticated user

    const blogData = {
      ...validation.value,
      createdBy: defaultUserId
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

// Export the handlers
export async function GET(req: NextRequest) {
  return getBlogsHandler(req);
}

export async function POST(req: NextRequest) {
  return createBlogHandler(req);
}
