import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutUs from '@/models/AboutUs';
import User from '@/models/User'; // Import User model to ensure it's registered
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';
import { logActivity } from '@/lib/activity';

// GET /api/about-us - Get about us content
async function getAboutUsHandler(req: AuthenticatedRequest) {
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
    const aboutUs = await AboutUs.findActive();

    if (!aboutUs) {
      // Return default content if none exists
      const defaultContent = {
        heroSection: {
          tagline: "Laxmi Developers",
          title: "Brick by Brick ",
          titleHighlight: "Building Excellence",
          description: "With over a decade of excellence in real estate development, we transform visions into reality through innovative design and uncompromising quality.",
          buttonText: "Our Projects",
          backgroundImage: "/images/hero/hero-1.jpg"
        },
        companySection: {
          tagline: "Our Story",
          title: "Pioneering Excellence in Real Estate",
          description1: "Excellence in Real Estate Development",
          description2: "Our Foundation",
          image: "/images/homepage/about.jpg"
        },
        missionVisionValues: {
          sectionTagline: "Mission, Vision & Values",
          sectionTitle: "The principles that guide everything we do",
          sectionDescription: "",
          items: [
            {
              title: "Mission",
              description: "To create exceptional living and working spaces that enhance the quality of life for our customers while contributing to sustainable urban development."
            },
            {
              title: "Vision",
              description: "To be the most trusted and innovative real estate developer, setting new standards for quality, design, and customer experience."
            },
            {
              title: "Values",
              description: "Integrity, Innovation, Quality, Customer Focus, and Sustainability drive every decision we make and every project we undertake."
            }
          ]
        },
        portfolioSection: {
          tagline: "Our Work",
          title: "Featured Projects",
          description: "Discover some of our most prestigious developments",
          buttonText: "View All Projects",
          projects: [
            {
              title: "Millennium Park",
              category: "Residential",
              image: "/images/projects/Millennium Park.jpg"
            },
            {
              title: "Business Hub",
              category: "Commercial",
              image: "/images/projects/Millennium Business Hub.jpg"
            },
            {
              title: "Laxmi Nova",
              category: "Residential",
              image: "/images/projects/Laxmi Nova.jpg"
            }
          ]
        },
        ctaSection: {
          title: "Ready to Start Your Journey?",
          description: "Let us help you find your perfect space or investment opportunity.",
          primaryButton: {
            text: "Contact Us",
            href: "/contact"
          },
          secondaryButton: {
            text: "View Projects",
            href: "/projects"
          }
        }
      };

      return NextResponse.json({
        success: true,
        data: defaultContent
      });
    }

    return NextResponse.json({
      success: true,
      data: aboutUs.toObject()
    });

  } catch (error) {
    console.error('Get about us error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about us content' },
      { status: 500 }
    );
  }
}

// PUT /api/about-us - Update about us content (admin only)
async function updateAboutUsHandler(req: AuthenticatedRequest) {
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

    // Find existing about us content or create new
    let aboutUs = await AboutUs.findOne({ isActive: true });

    if (aboutUs) {
      // Update existing
      Object.assign(aboutUs, body);
      aboutUs.updatedBy = req.user!.userId;
      await aboutUs.save();
    } else {
      // Create new
      aboutUs = await AboutUs.create({
        ...body,
        createdBy: req.user!.userId,
        updatedBy: req.user!.userId
      });
    }

    // Log activity
    await logActivity({
      type: 'system',
      action: 'update',
      title: 'Updated About Us content',
      userId: req.user!.userId,
      userName: req.user!.email,
      entityId: aboutUs._id.toString(),
      entityType: 'about_us'
    });

    return NextResponse.json({
      success: true,
      message: 'About us content updated successfully',
      data: aboutUs.toObject()
    });

  } catch (error) {
    console.error('Update about us error:', error);
    return NextResponse.json(
      { error: 'Failed to update about us content' },
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

// Route handlers
export const GET = withMiddleware(
  withCors,
  withOptionalAuth,
  withErrorHandling
)(getAboutUsHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateAboutUsHandler);
