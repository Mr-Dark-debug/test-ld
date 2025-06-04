import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

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

// POST /api/leads - Create new lead
async function createLeadHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      type,
      name,
      email,
      phone,
      projectId,
      projectInterest,
      message,
      jobId,
      experience,
      resumeUrl,
      source,
      assignedTo
    } = body;

    // Validate required fields
    if (!type || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Type, name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create new lead
    const newLead = new Lead({
      type,
      name,
      email,
      phone,
      projectId,
      projectInterest,
      message,
      jobId,
      experience,
      resumeUrl,
      source: source || 'website',
      assignedTo,
      status: 'new'
    });

    await newLead.save();

    // Populate references for response
    await newLead.populate('assignedTo', 'name email');
    await newLead.populate('projectId', 'title slug');

    // Log activity
    await logActivity({
      type: 'lead',
      action: 'create',
      title: `New lead created: ${name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: newLead._id.toString(),
      entityType: 'lead'
    });

    return NextResponse.json({
      success: true,
      data: newLead,
      message: 'Lead created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// Export the handlers directly
export async function GET(req: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return getLeadsHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('GET leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return createLeadHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('POST leads error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
