import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Award from '@/models/Award';
import { verifyAuth } from '@/lib/auth';

// GET - Fetch all awards
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const awards = await Award.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: awards,
    });
  } catch (error: any) {
    console.error('Error fetching awards:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch awards',
      },
      { status: 500 }
    );
  }
}

// POST - Create new award
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has permission to create awards
    if (!['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, description, image, isActive } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and description are required',
        },
        { status: 400 }
      );
    }

    // Create new award
    const award = new Award({
      title,
      description,
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    await award.save();

    return NextResponse.json({
      success: true,
      data: award,
      message: 'Award created successfully',
    });
  } catch (error: any) {
    console.error('Error creating award:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create award',
      },
      { status: 500 }
    );
  }
}

// PUT - Update award
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has permission to update awards
    if (!['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Award ID is required',
        },
        { status: 400 }
      );
    }

    const award = await Award.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!award) {
      return NextResponse.json(
        {
          success: false,
          error: 'Award not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: award,
      message: 'Award updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating award:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update award',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete award
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has permission to delete awards
    if (!['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Award ID is required',
        },
        { status: 400 }
      );
    }

    const award = await Award.findByIdAndDelete(id);

    if (!award) {
      return NextResponse.json(
        {
          success: false,
          error: 'Award not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Award deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting award:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete award',
      },
      { status: 500 }
    );
  }
}
