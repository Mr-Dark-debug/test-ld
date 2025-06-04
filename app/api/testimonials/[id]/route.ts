import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { validateRequest, updateTestimonialSchema } from '@/lib/validation';
import mongoose from 'mongoose';

// GET /api/testimonials/[id] - Get single testimonial
async function getTestimonialHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial
    });

  } catch (error) {
    console.error('Get testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update testimonial (admin only)
async function updateTestimonialHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body, updateTestimonialSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      validation.value,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });

  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial (admin only)
async function deleteTestimonialHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

// PATCH /api/testimonials/[id] - Approve/reject testimonial (admin only)
async function patchTestimonialHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject', 'feature', 'unfeature'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, reject, feature, or unfeature' },
        { status: 400 }
      );
    }

    let updateData: any = {};
    
    switch (action) {
      case 'approve':
        updateData = { isApproved: true };
        break;
      case 'reject':
        updateData = { isApproved: false };
        break;
      case 'feature':
        updateData = { isFeatured: true, isApproved: true };
        break;
      case 'unfeature':
        updateData = { isFeatured: false };
        break;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Testimonial ${action}d successfully`,
      data: testimonial
    });

  } catch (error) {
    console.error('Patch testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// Export the handlers with middleware
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return getTestimonialHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('GET testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return updateTestimonialHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('PUT testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return deleteTestimonialHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('DELETE testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return patchTestimonialHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('PATCH testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
