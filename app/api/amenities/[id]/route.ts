import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Amenity from '@/models/Amenity';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { validateRequest } from '@/lib/validation';
import Joi from 'joi';

// Validation schema for updates
const updateAmenitySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  icon: Joi.string().trim(),
  category: Joi.string().trim(),
  description: Joi.string().allow('').max(200),
  isActive: Joi.boolean()
}).min(1); // Require at least one field

// GET /api/amenities/[id] - Get amenity by ID
async function getAmenityHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const amenity = await Amenity.findById(params.id);
    
    if (!amenity) {
      return NextResponse.json(
        { error: 'Amenity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: amenity
    });
  } catch (error) {
    console.error('Get amenity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenity' },
      { status: 500 }
    );
  }
}

// PUT /api/amenities/[id] - Update amenity (admin only)
async function updateAmenityHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await req.json();
    
    // Validate request body
    const validation = validateRequest(body, updateAmenitySchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Update amenity
    const amenity = await Amenity.findByIdAndUpdate(
      params.id,
      { $set: validation.value },
      { new: true, runValidators: true }
    );

    if (!amenity) {
      return NextResponse.json(
        { error: 'Amenity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Amenity updated successfully',
      data: amenity
    });
  } catch (error: any) {
    console.error('Update amenity error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update amenity' },
      { status: 500 }
    );
  }
}

// DELETE /api/amenities/[id] - Delete amenity (admin only)
async function deleteAmenityHandler(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const amenity = await Amenity.findByIdAndDelete(params.id);
    
    if (!amenity) {
      return NextResponse.json(
        { error: 'Amenity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Amenity deleted successfully'
    });
  } catch (error) {
    console.error('Delete amenity error:', error);
    return NextResponse.json(
      { error: 'Failed to delete amenity' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getAmenityHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateAmenityHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteAmenityHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest, context: { params: { id: string } }) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
