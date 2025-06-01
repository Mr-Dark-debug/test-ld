import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

// GET /api/leads/[id] - Get specific lead
async function getLeadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;

    const lead = await Lead.findById(id)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title slug')
      .lean();

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PUT /api/leads/[id] - Update specific lead
async function updateLeadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      email,
      phone,
      message,
      status,
      assignedTo,
      followUpDate,
      notes,
      projectInterest,
      experience
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        message,
        status,
        assignedTo,
        followUpDate,
        notes,
        projectInterest,
        experience,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    )
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title slug');

    if (!updatedLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'lead',
      action: 'update',
      title: `Updated lead: ${updatedLead.name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: id,
      entityType: 'lead'
    });

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete specific lead (admin only)
async function deleteLeadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    await Lead.findByIdAndDelete(id);

    // Log activity
    await logActivity({
      type: 'lead',
      action: 'delete',
      title: `Deleted lead: ${lead.name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: id,
      entityType: 'lead'
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] - Update lead status or assignment
async function patchLeadHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action, value } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let updateData: any = {};
    let activityTitle = '';

    switch (action) {
      case 'status':
        updateData.status = value;
        activityTitle = `Changed lead status to ${value}`;
        break;
      case 'assign':
        updateData.assignedTo = value;
        activityTitle = `Assigned lead to user`;
        break;
      case 'follow_up':
        updateData.followUpDate = value;
        activityTitle = `Set follow-up date`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title slug');

    if (!updatedLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'lead',
      action: 'update',
      title: `${activityTitle}: ${updatedLead.name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: id,
      entityType: 'lead'
    });

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Patch lead error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
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

// Export the handlers with middleware
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getLeadHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateLeadHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteLeadHandler);

export const PATCH = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(patchLeadHandler);
