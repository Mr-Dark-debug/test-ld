import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// GET /api/leads - Get all leads (admin only)
async function getLeadsHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');

    // Build query
    const query: any = {};
    
    if (type && ['contact', 'brochure', 'career'].includes(type)) {
      query.type = type;
    }
    
    if (status && ['new', 'contacted', 'qualified', 'converted', 'closed'].includes(status)) {
      query.status = status;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .populate('projectId', 'title type status')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    // Get lead statistics
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      stats: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getLeadsHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
