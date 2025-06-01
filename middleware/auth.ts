import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, hasRole, JWTPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Authentication middleware for API routes
 */
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = getUserFromRequest(req);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Add user to request object
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user;
      
      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Role-based authorization middleware
 */
export function withRole(roles: string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      if (!req.user || !hasRole(req.user, roles)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return await handler(req);
    });
  };
}

/**
 * Admin-only middleware (super_admin and admin roles)
 */
export function withAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['super_admin', 'admin'])(handler);
}

/**
 * Super admin-only middleware
 */
export function withSuperAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['super_admin'])(handler);
}

/**
 * Editor and above middleware (all authenticated users)
 */
export function withEditor(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(['super_admin', 'admin', 'editor'])(handler);
}

/**
 * Optional authentication middleware (doesn't fail if no auth)
 */
export function withOptionalAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const user = getUserFromRequest(req);
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user || undefined;
      
      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Optional authentication middleware error:', error);
      const authenticatedReq = req as AuthenticatedRequest;
      return await handler(authenticatedReq);
    }
  };
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      
      // Clean up expired entries
      for (const [key, value] of requests.entries()) {
        if (now > value.resetTime) {
          requests.delete(key);
        }
      }
      
      const current = requests.get(ip);
      
      if (!current) {
        requests.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (now > current.resetTime) {
        requests.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (current.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      } else {
        current.count++;
      }
      
      return await handler(req);
    };
  };
}

/**
 * CORS middleware
 */
export function withCors(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    const response = await handler(req);
    
    // Add CORS headers to response
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  };
}

/**
 * Error handling middleware
 */
export function withErrorHandling(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('validation')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        
        // Handle duplicate key errors
        if (error.message.includes('duplicate key')) {
          return NextResponse.json(
            { error: 'Resource already exists' },
            { status: 409 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Combine multiple middlewares
 */
export function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
