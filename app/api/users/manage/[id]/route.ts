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

    // Get the user being updated to check role hierarchy
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Role hierarchy protection - no one can modify super admin except super admin
    if (existingUser.role === 'super_admin' && req.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Only super admin can modify super admin users.' },
        { status: 403 }
      );
    }

    // Role hierarchy validation for role changes
    if (role && role !== existingUser.role) {
      const roleHierarchy = {
        'super_admin': 4,
        'admin': 3,
        'editor': 2,
        'user': 1
      };

      const currentUserLevel = roleHierarchy[req.user.role as keyof typeof roleHierarchy] || 0;
      const targetRoleLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
      const existingRoleLevel = roleHierarchy[existingUser.role as keyof typeof roleHierarchy] || 0;

      // Admins cannot promote users to super admin
      if (req.user.role === 'admin' && role === 'super_admin') {
        return NextResponse.json(
          { error: 'Access denied. Admins cannot promote users to super admin.' },
          { status: 403 }
        );
      }

      // Users can only assign roles lower than their own level (except super admin can assign any role)
      if (req.user.role !== 'super_admin' && targetRoleLevel >= currentUserLevel) {
        return NextResponse.json(
          { error: 'Access denied. You can only assign roles lower than your own.' },
          { status: 403 }
        );
      }

      // Users can only modify users with roles lower than their own (except super admin)
      if (req.user.role !== 'super_admin' && existingRoleLevel >= currentUserLevel) {
        return NextResponse.json(
          { error: 'Access denied. You can only modify users with roles lower than your own.' },
          { status: 403 }
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

    // Role hierarchy protection - no one can delete super admin
    if (user.role === 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Super admin users cannot be deleted.' },
        { status: 403 }
      );
    }

    // Role hierarchy validation
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'editor': 2,
      'user': 1
    };

    const currentUserLevel = roleHierarchy[req.user.role as keyof typeof roleHierarchy] || 0;
    const targetUserLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;

    // Users can only delete users with roles lower than their own
    if (targetUserLevel >= currentUserLevel) {
      return NextResponse.json(
        { error: 'Access denied. You can only delete users with roles lower than your own.' },
        { status: 403 }
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

// Export the handlers directly
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return getUserHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('GET user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return updateUserHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('PUT user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return deleteUserHandler(authReq, context);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('DELETE user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
