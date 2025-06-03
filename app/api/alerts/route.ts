import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Lead from '@/models/Lead';
import Project from '@/models/Project';
import Testimonial from '@/models/Testimonial';

// GET - Fetch dashboard alerts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const alerts = [];

    // Check for pending blog approvals (draft blogs)
    const pendingBlogs = await BlogPost.countDocuments({
      status: 'draft'
    });

    if (pendingBlogs > 0) {
      alerts.push({
        type: 'warning',
        title: 'blogs pending approval',
        description: 'Review and publish',
        count: pendingBlogs,
        link: '/cms-admin/dashboard/blogs'
      });
    }

    // Check for high priority leads (leads from last 24 hours without follow-up)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const highPriorityLeads = await Lead.countDocuments({
      createdAt: { $gte: yesterday },
      status: 'new'
    });

    if (highPriorityLeads > 0) {
      alerts.push({
        type: 'error',
        title: 'high priority leads',
        description: 'Need follow-up',
        count: highPriorityLeads,
        link: '/cms-admin/dashboard/leads'
      });
    }

    // Check for projects without images
    const projectsWithoutImages = await Project.countDocuments({
      $or: [
        { 'images.coverImage': { $exists: false } },
        { 'images.coverImage': '' },
        { 'images.coverImage': null },
        {
          $and: [
            { 'images.gallery.promotional': { $size: 0 } },
            { 'images.gallery.exterior': { $size: 0 } },
            { 'images.gallery.interior': { $size: 0 } }
          ]
        }
      ]
    });

    if (projectsWithoutImages > 0) {
      alerts.push({
        type: 'warning',
        title: 'projects missing images',
        description: 'Add cover images and gallery',
        count: projectsWithoutImages,
        link: '/cms-admin/dashboard/projects'
      });
    }

    // Check for testimonials pending approval
    const pendingTestimonials = await Testimonial.countDocuments({
      isApproved: false
    });

    if (pendingTestimonials > 0) {
      alerts.push({
        type: 'warning',
        title: 'testimonials pending approval',
        description: 'Review and activate',
        count: pendingTestimonials,
        link: '/cms-admin/dashboard/testimonials'
      });
    }

    // If no alerts, show system operational
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        title: 'All systems operational',
        description: 'No issues detected',
        count: 0,
        link: null
      });
    }

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch alerts',
      },
      { status: 500 }
    );
  }
}
