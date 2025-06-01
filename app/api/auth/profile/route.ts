import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// PUT /api/auth/profile - Update user profile (authenticated users only)
async function updateProfileHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    // Check if user is authenticated
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const userId = req.user.userId;

    // Only allow specific fields to be updated
    const allowedFields = ['name', 'phone'];
    const updateData: Record<string, any> = {};

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log the activity
    await Activity.create({
      type: 'user',
      action: 'update',
      title: 'User profile updated',
      userId: user._id,
      userName: user.name,
      description: `Updated profile fields: ${Object.keys(updateData).join(', ')}`
    });

    // Return user object (without password)
    const userData = user.toSafeObject();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userData
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Route handlers
export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateProfileHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
} 