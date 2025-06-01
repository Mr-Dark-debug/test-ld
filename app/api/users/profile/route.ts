import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

// GET /api/users/profile - Get current user profile
async function getUserProfileHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
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
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update current user profile
async function updateUserProfileHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const userId = req.user._id;
    const body = await req.json();

    const {
      name,
      email,
      phone,
      bio,
      profileImage,
      preferences,
      notifications
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
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        bio,
        profileImage,
        preferences: preferences || {},
        notifications: notifications || {},
        updatedAt: new Date()
      },
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
      action: 'update_profile',
      title: 'Updated profile information',
      userId: userId,
      userName: updatedUser.name,
      entityId: userId,
      entityType: 'user'
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
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
)(getUserProfileHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateUserProfileHandler);
