import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { validateRequest, updateBlogSchema } from '@/lib/validation';
import mongoose from 'mongoose';

// GET /api/blogs/[slug] - Get single blog post by slug or ID
async function getBlogHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    let blog;

    // Check if slug is a valid ObjectId (for admin access by ID)
    if (mongoose.Types.ObjectId.isValid(slug)) {
      const query = isAdmin ? { _id: slug } : { _id: slug, status: 'published' };
      blog = await BlogPost.findOne(query)
        .populate('createdBy', 'name email')
        .lean();
    } else {
      // Find by slug
      const query = isAdmin ? { slug } : { slug, status: 'published' };
      blog = await BlogPost.findOne(query)
        .populate('createdBy', 'name email')
        .lean();
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Transform data to include featuredImage for frontend compatibility
    const transformedBlog = {
      ...blog,
      featuredImage: blog.coverImage
    };

    return NextResponse.json({
      success: true,
      data: transformedBlog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[slug] - Update blog post (admin only)
async function updateBlogHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  try {
    const { slug } = await params;
    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body, updateBlogSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const blog = await BlogPost.findOneAndUpdate(
      { slug },
      validation.value,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });

  } catch (error) {
    console.error('Update blog error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A blog post with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[slug] - Delete blog post (admin only)
async function deleteBlogHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  try {
    const { slug } = await params;

    const blog = await BlogPost.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

// Export the handlers
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return getBlogHandler(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return updateBlogHandler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return deleteBlogHandler(req, context);
}
