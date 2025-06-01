import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// GET /api/activities - Get recent activities (admin only)
async function getActivitiesHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');

    // Build query
    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (userId) {
      query.userId = userId;
    }

    if (entityId && entityType) {
      query.entityId = entityId;
      query.entityType = entityType;
    }

    // Get activities
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create a new activity log (admin only)
async function createActivityHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();

    // Ensure required fields are present
    if (!body.type || !body.action || !body.title || !body.userId || !body.userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create activity
    const activity = await Activity.create(body);

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      data: activity
    }, { status: 201 });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getActivitiesHandler);

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createActivityHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
} 