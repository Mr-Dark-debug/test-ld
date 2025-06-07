import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { JobOpening } from '@/models/Career';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

// GET /api/careers - Get all job openings
async function getCareersHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const isActive = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};
    
    if (department) query.department = new RegExp(department, 'i');
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');
    if (isActive !== null) query.isActive = isActive === 'true';

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Careers query:', query);
    console.log('Pagination:', { page, limit, skip });

    // Get job openings
    const startTime = Date.now();
    const jobOpenings = await JobOpening.find(query)
      .populate('createdBy', 'name email')
      .sort({ isUrgent: -1, postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${jobOpenings.length} job openings in ${Date.now() - startTime}ms`);

    // Get total count for pagination
    const total = await JobOpening.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: jobOpenings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get careers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job openings' },
      { status: 500 }
    );
  }
}

// POST /api/careers - Create new job opening (admin only)
async function createCareerHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const jobData = {
      ...body,
      createdBy: req.user!.userId,
      updatedBy: req.user!.userId
    };

    const jobOpening = await JobOpening.create(jobData);

    // Log activity
    await logActivity({
      type: 'career',
      action: 'create',
      title: `Created job opening: ${jobOpening.title}`,
      userId: req.user!.userId,
      userName: req.user!.email,
      entityId: jobOpening._id.toString(),
      entityType: 'job_opening'
    });

    return NextResponse.json({
      success: true,
      message: 'Job opening created successfully',
      data: jobOpening
    }, { status: 201 });

  } catch (error) {
    console.error('Create career error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A job opening with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create job opening' },
      { status: 500 }
    );
  }
}

// PUT /api/careers - Update job opening (admin only)
async function updateCareerHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Job opening ID is required' },
        { status: 400 }
      );
    }

    const jobOpening = await JobOpening.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: req.user!.userId,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!jobOpening) {
      return NextResponse.json(
        { error: 'Job opening not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'career',
      action: 'update',
      title: `Updated job opening: ${jobOpening.title}`,
      userId: req.user!.userId,
      userName: req.user!.email,
      entityId: jobOpening._id.toString(),
      entityType: 'job_opening'
    });

    return NextResponse.json({
      success: true,
      message: 'Job opening updated successfully',
      data: jobOpening
    });

  } catch (error) {
    console.error('Update career error:', error);
    return NextResponse.json(
      { error: 'Failed to update job opening' },
      { status: 500 }
    );
  }
}

// DELETE /api/careers - Delete job opening (admin only)
async function deleteCareerHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Job opening ID is required' },
        { status: 400 }
      );
    }

    const jobOpening = await JobOpening.findByIdAndDelete(id);

    if (!jobOpening) {
      return NextResponse.json(
        { error: 'Job opening not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'career',
      action: 'delete',
      title: `Deleted job opening: ${jobOpening.title}`,
      userId: req.user!.userId,
      userName: req.user!.email,
      entityId: jobOpening._id.toString(),
      entityType: 'job_opening'
    });

    return NextResponse.json({
      success: true,
      message: 'Job opening deleted successfully'
    });

  } catch (error) {
    console.error('Delete career error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job opening' },
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

// Route handlers
export const GET = withMiddleware(
  withCors,
  withOptionalAuth,
  withErrorHandling
)(getCareersHandler);

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createCareerHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateCareerHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteCareerHandler);
