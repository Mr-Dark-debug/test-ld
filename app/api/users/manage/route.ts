import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';
import bcrypt from 'bcryptjs';

// GET /api/users/manage - Get all users (admin only)
async function getUsersHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.isActive = status === 'active';
    }

    // Get users with pagination
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users/manage - Create new user (admin only)
async function createUserHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    // Check if user is admin or super admin (both can create users)
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

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
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
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
    const targetRoleLevel = roleHierarchy[(role || 'user') as keyof typeof roleHierarchy] || 0;

    // Admins cannot create super admins
    if (req.user.role === 'admin' && role === 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied. Admins cannot create super admin users.' },
        { status: 403 }
      );
    }

    // Users can only create roles lower than their own level (except super admin can create anyone)
    if (req.user.role !== 'super_admin' && targetRoleLevel >= currentUserLevel) {
      return NextResponse.json(
        { error: 'Access denied. You can only create users with roles lower than your own.' },
        { status: 403 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      bio,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // Log activity
    await logActivity({
      type: 'user',
      action: 'create',
      title: `Created new user: ${name}`,
      userId: req.user._id,
      userName: req.user.name,
      entityId: newUser._id.toString(),
      entityType: 'user'
    });

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Export the handlers directly
export async function GET(req: NextRequest) {
  try {
    // Apply authentication middleware
    const authResult = await withAuth(async (authReq: AuthenticatedRequest) => {
      return getUsersHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('GET users error:', error);
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
      return createUserHandler(authReq);
    })(req as AuthenticatedRequest);

    return authResult;
  } catch (error) {
    console.error('POST users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
