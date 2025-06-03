import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactUs from '@/models/ContactUs';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';

// GET /api/contact-us - Get active contact-us content
async function getContactUsHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const contactUs = await ContactUs.findOne({ isActive: true })
      .populate('createdBy', 'name email')
      .lean();

    if (!contactUs) {
      // Return default content if none exists
      const defaultContent = {
        contactInfo: {
          address: {
            street: "123 Business District",
            city: "Surat",
            state: "Gujarat",
            zipCode: "395007",
            country: "India"
          },
          phone: {
            primary: "+91 98765 43210",
            secondary: "+91 98765 43211"
          },
          email: {
            primary: "info@laxmidev.com",
            support: "support@laxmidev.com"
          },
          hours: {
            weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
            weekends: "Saturday: 10:00 AM - 4:00 PM, Sunday: Closed"
          },
          mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.9!2d72.8311!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEwJzEyLjciTiA3MsKwNDknNTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
        },
        socialMedia: {
          facebook: "https://facebook.com/laxmidev",
          instagram: "https://instagram.com/laxmidev",
          twitter: "https://twitter.com/laxmidev",
          linkedin: "https://linkedin.com/company/laxmidev",
          youtube: "https://youtube.com/laxmidev"
        }
      };

      return NextResponse.json({
        success: true,
        data: defaultContent
      });
    }

    return NextResponse.json({
      success: true,
      data: contactUs
    });

  } catch (error) {
    console.error('Get contact-us error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact-us content' },
      { status: 500 }
    );
  }
}

// POST /api/contact-us - Create/Update contact-us content (admin only)
async function createContactUsHandler(req: AuthenticatedRequest) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const contactUsData = {
      ...body,
      createdBy: req.user!.userId,
      isActive: true
    };

    // Create new contact-us content (will automatically deactivate others)
    const contactUs = await ContactUs.create(contactUsData);

    return NextResponse.json({
      success: true,
      message: 'Contact-us content updated successfully',
      data: contactUs
    }, { status: 201 });

  } catch (error) {
    console.error('Create contact-us error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact-us content' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withOptionalAuth,
  withErrorHandling
)(getContactUsHandler);

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createContactUsHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
