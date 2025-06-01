import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Amenity from '@/models/Amenity';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { validateRequest } from '@/lib/validation';
import Joi from 'joi';

// Validation schema
const amenitySchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  icon: Joi.string().required().trim(),
  category: Joi.string().required().trim(),
  description: Joi.string().allow('').optional().max(200),
  isActive: Joi.boolean().default(true),
});

// GET /api/amenities - Get all amenities
async function getAmenitiesHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') === 'true';
    const groupByCategory = searchParams.get('groupByCategory') === 'true';

    // Build query
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (activeOnly) {
      query.isActive = true;
    }

    // Get amenities
    let amenities;
    
    if (groupByCategory) {
      // Group by category
      amenities = await Amenity.aggregate([
        { $match: query },
        { $sort: { name: 1 } },
        {
          $group: {
            _id: '$category',
            amenities: { $push: '$$ROOT' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } else {
      // Standard list
      amenities = await Amenity.find(query).sort({ category: 1, name: 1 });
    }

    return NextResponse.json({
      success: true,
      data: amenities
    });
  } catch (error) {
    console.error('Get amenities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}

// POST /api/amenities - Create a new amenity (admin only)
async function createAmenityHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();
    
    // Validate request body
    const validation = validateRequest(body, amenitySchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create amenity
    const amenity = await Amenity.create(validation.value);

    return NextResponse.json({
      success: true,
      message: 'Amenity created successfully',
      data: amenity
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create amenity error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create amenity' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getAmenitiesHandler);

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createAmenityHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
