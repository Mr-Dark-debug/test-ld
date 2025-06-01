import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withErrorHandling, withCors, withRateLimit } from '@/middleware/auth';
import { validateRequest, contactLeadSchema } from '@/lib/validation';

// POST /api/leads/contact - Submit contact form
async function contactHandler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  await connectDB();

  try {
    const body = await req.json();
    
    // Validate request body
    const validation = validateRequest(body, contactLeadSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const leadData = {
      ...validation.value,
      type: 'contact',
      source: 'website'
    };

    const lead = await Lead.create(leadData);

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.',
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    );
  }
}

// Apply middlewares
export const POST = withMiddleware(
  withCors,
  withRateLimit(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  withErrorHandling
)(contactHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
