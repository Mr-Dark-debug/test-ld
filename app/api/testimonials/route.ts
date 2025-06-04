import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';
import { validateRequest, createTestimonialSchema } from '@/lib/validation';

// GET /api/testimonials - Get testimonials
async function getTestimonialsHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const approved = searchParams.get('approved');
    const featured = searchParams.get('featured');
    const projectId = searchParams.get('projectId');
    const minRating = searchParams.get('minRating');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};
    
    // For public access, only show approved testimonials
    if (!req.user || approved !== 'false') {
      query.isApproved = true;
    } else if (approved === 'false') {
      query.isApproved = false;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find(query)
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Testimonial.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial
async function createTestimonialHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();
    
    // Validate request body
    const validation = validateRequest(body, createTestimonialSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // If user is not admin, set isApproved to false for moderation
    const testimonialData = {
      ...validation.value,
      isApproved: req.user ? true : false // Auto-approve if admin creates it
    };

    const testimonial = await Testimonial.create(testimonialData);

    return NextResponse.json({
      success: true,
      message: req.user 
        ? 'Testimonial created successfully' 
        : 'Testimonial submitted for approval',
      data: testimonial
    }, { status: 201 });

  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

// Export the handlers directly
export async function GET(req: NextRequest) {
  try {
    // Apply optional authentication middleware (allows both authenticated and public access)
    const authResult = await withOptionalAuth(async (authReq: AuthenticatedRequest) => {
      return getTestimonialsHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('GET testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Apply authentication middleware for creating testimonials
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return createTestimonialHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('POST testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
