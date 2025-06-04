import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withErrorHandling, withCors, withRateLimit } from '@/middleware/auth';
import { validateRequest, contactLeadSchema } from '@/lib/validation';
import { API_CONFIG } from '@/lib/config';

// POST /api/leads/contact - Submit contact form
async function contactHandler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Ensure database connection
    await connectDB();

    const body = await req.json();
    console.log('Received contact form data:', body);

    // Validate request body
    const validation = validateRequest(body, contactLeadSchema);
    if (validation.error) {
      console.error('Validation error:', validation.error);
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

    console.log('Creating lead with data:', leadData);
    const lead = await Lead.create(leadData);
    console.log('Lead created successfully:', lead._id);

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
  withRateLimit(
    API_CONFIG.RATE_LIMIT.CONTACT_FORM.MAX_REQUESTS,
    API_CONFIG.RATE_LIMIT.CONTACT_FORM.WINDOW_MS
  ),
  withErrorHandling
)(contactHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
