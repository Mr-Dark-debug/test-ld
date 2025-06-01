import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Project from '@/models/Project';
import { withErrorHandling, withCors, withRateLimit } from '@/middleware/auth';
import { validateRequest, brochureLeadSchema } from '@/lib/validation';

// POST /api/leads/brochure - Submit brochure download form
async function brochureHandler(req: NextRequest) {
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
    const validation = validateRequest(body, brochureLeadSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { projectId, name, email, phone } = validation.value!;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if project has brochure
    if (!project.brochureUrl) {
      return NextResponse.json(
        { error: 'Brochure not available for this project' },
        { status: 400 }
      );
    }

    // Create lead record
    const leadData = {
      name,
      email,
      phone,
      projectId,
      type: 'brochure',
      source: 'website',
      message: `Requested brochure for ${project.title}`
    };

    const lead = await Lead.create(leadData);

    // TODO: Send brochure email to user
    // TODO: Send notification to admin

    return NextResponse.json({
      success: true,
      message: 'Brochure download link has been sent to your email!',
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        projectTitle: project.title,
        brochureUrl: project.brochureUrl
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Brochure download error:', error);
    return NextResponse.json(
      { error: 'Failed to process brochure request. Please try again.' },
      { status: 500 }
    );
  }
}

// Apply middlewares
export const POST = withMiddleware(
  withCors,
  withRateLimit(3, 15 * 60 * 1000), // 3 requests per 15 minutes
  withErrorHandling
)(brochureHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: NextRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
