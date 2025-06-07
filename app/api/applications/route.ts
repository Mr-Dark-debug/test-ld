import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { JobApplication } from '@/models/Career';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

// GET /api/applications - Get all job applications (admin only)
async function getApplicationsHandler(req: AuthenticatedRequest) {
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
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};
    
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Applications query:', query);
    console.log('Pagination:', { page, limit, skip });

    // Get applications
    const startTime = Date.now();
    const applications = await JobApplication.find(query)
      .populate('jobId', 'title department location')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${applications.length} applications in ${Date.now() - startTime}ms`);

    // Get total count for pagination
    const total = await JobApplication.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Submit new job application (public)
async function createApplicationHandler(req: NextRequest) {
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

    // Validate required fields
    const requiredFields = ['jobId', 'firstName', 'lastName', 'email', 'phone', 'experience', 'resumeUrl'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create application data
    const applicationData = {
      jobId: body.jobId,
      applicantInfo: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address || '',
        linkedinUrl: body.linkedinUrl || '',
        portfolioUrl: body.portfolioUrl || ''
      },
      resume: {
        filename: 'resume.pdf',
        url: body.resumeUrl,
        uploadedAt: new Date()
      },
      coverLetter: body.coverLetter || '',
      experience: body.experience,
      expectedSalary: body.expectedSalary || null,
      availableFrom: body.availableFrom ? new Date(body.availableFrom) : null,
      status: 'new'
    };

    const application = await JobApplication.create(applicationData);

    // Populate job details for response
    await application.populate('jobId', 'title department location');

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    }, { status: 201 });

  } catch (error) {
    console.error('Create application error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// PUT /api/applications - Update application status (admin only)
async function updateApplicationHandler(req: AuthenticatedRequest) {
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
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      {
        status,
        notes: notes || '',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('jobId', 'title department location');

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'application',
      action: 'update',
      title: `Updated application status to ${status}`,
      userId: req.user!.userId,
      userName: req.user!.email,
      entityId: application._id.toString(),
      entityType: 'job_application'
    });

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
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
  withAuth,
  withErrorHandling
)(getApplicationsHandler);

export async function POST(req: NextRequest) {
  return withCors(
    withErrorHandling(
      createApplicationHandler
    )
  )(req);
}

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateApplicationHandler);
