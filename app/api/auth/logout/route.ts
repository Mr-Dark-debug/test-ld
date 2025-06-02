import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, withCors } from '@/middleware/auth';

async function logoutHandler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) =>
    middlewares.reduceRight(
      (prevHandler, middleware) => middleware(prevHandler),
      handler
    );
}

// Apply middlewares
export const POST = withMiddleware(
  withCors,
  withErrorHandling
)(logoutHandler);
