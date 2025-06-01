import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';
import bcrypt from 'bcryptjs';

// GET /api/users/manage/[id] - Get specific user (admin only)
async function getUserHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const user = await User.findById(id)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/manage/[id] - Update specific user (admin only)
async function updateUserHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      phone,
      bio,
      isActive
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      role,
      phone,
      bio,
      isActive,
      updatedAt: new Date()
    };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).select('-password -refreshToken');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log activity
    await logActivity({
      type: 'user',
      action: 'update',
      title: `Updated user: ${updatedUser.name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: id,
      entityType: 'user'
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/manage/[id] - Delete specific user (admin only)
async function deleteUserHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    // Check if user is super admin
    if (req.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Super admin privileges required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === req.user._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete by deactivating
    await User.findByIdAndUpdate(id, { 
      isActive: false,
      deletedAt: new Date(),
      deletedBy: req.user._id
    });

    // Log activity
    await logActivity({
      type: 'user',
      action: 'delete',
      title: `Deleted user: ${user.name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: id,
      entityType: 'user'
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
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
)(getUserHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateUserHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteUserHandler);
