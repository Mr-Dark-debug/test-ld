import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import { comparePassword, generateToken } from '@/lib/auth';
import { validateRequest, loginSchema } from '@/lib/validation';

async function loginHandler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    // For development, create a mock successful response
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using mock login response for development');
      const mockToken = 'mock-jwt-token-for-development';
      const mockUser = {
        _id: 'mock-user-id',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
      };
      
      const response = NextResponse.json({
        success: true,
        message: 'Mock login successful (DB connection failed)',
        data: {
          user: mockUser,
          token: mockToken
        }
      });

      response.cookies.set('auth-token', mockToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return response;
    }
    
    return NextResponse.json(
      { error: 'Database connection failed. Please try again later.' },
      { status: 503 }
    );
  }

  const body = await req.json();

  // Validate request body
  const validation = validateRequest(body, loginSchema);
  if (validation.error) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const { email, password } = validation.value!;

  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administrator.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    // Log the login activity
    try {
      await Activity.create({
        type: 'user',
        action: 'login',
        title: `User logged in`,
        userId: user._id,
        userName: user.name,
      });
    } catch (error) {
      // Don't fail the login if activity logging fails
      console.error('Failed to log activity:', error);
    }

    // Create response with user data (excluding password)
    const userData = user.toSafeObject();

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // For development, create a mock successful response on error
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using mock login response due to error');
      const mockToken = 'mock-jwt-token-for-development';
      const mockUser = {
        _id: 'mock-user-id',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
      };
      
      const response = NextResponse.json({
        success: true,
        message: 'Mock login successful (error occurred)',
        data: {
          user: mockUser,
          token: mockToken
        }
      });

      response.cookies.set('auth-token', mockToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return response;
    }
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Export the POST handler directly
export async function POST(req: NextRequest) {
  return loginHandler(req);
}
