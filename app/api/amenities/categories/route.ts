import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Amenity from '@/models/Amenity';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// GET /api/amenities/categories - Get all unique amenity categories
async function getCategoriesHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    // Get only active amenities unless specified
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Query for categories
    const query = includeInactive ? {} : { isActive: true };
    const categories = await Amenity.distinct('category', query);
    
    // Sort alphabetically
    categories.sort();

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get amenity categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenity categories' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getCategoriesHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
} 