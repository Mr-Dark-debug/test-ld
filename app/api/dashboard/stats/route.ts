import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import BlogPost from '@/models/BlogPost';
import Lead from '@/models/Lead';
import Testimonial from '@/models/Testimonial';
import User from '@/models/User';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';

// GET /api/dashboard/stats - Get dashboard statistics (admin only)
async function getStatsHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    // Get current date for today's stats
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get last month for comparison
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    // Get basic counts
    const [
      totalProjects,
      publishedBlogs,
      totalLeads,
      totalTestimonials,
      totalUsers,
      newLeadsToday,
      projectsByType,
      projectsByStatus,
      leadsByStatus,
      recentLeads,
      featuredProjects,
      // Last month counts for comparison
      projectsLastMonth,
      blogsLastMonth,
      leadsLastMonth,
      testimonialsLastMonth,
      usersLastMonth
    ] = await Promise.all([
      Project.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      Lead.countDocuments(),
      Testimonial.countDocuments({ isApproved: true }),
      User.countDocuments({ isActive: true }),
      Lead.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      }),

      // Projects by type
      Project.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),

      // Projects by status
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Leads by status
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),

      // Recent leads (last 7 days)
      Lead.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),

      // Featured projects count
      Project.countDocuments({ featured: true }),

      // Last month counts for comparison
      Project.countDocuments({ createdAt: { $lt: lastMonth } }),
      BlogPost.countDocuments({
        status: 'published',
        createdAt: { $lt: lastMonth }
      }),
      Lead.countDocuments({ createdAt: { $lt: lastMonth } }),
      Testimonial.countDocuments({
        isApproved: true,
        createdAt: { $lt: lastMonth }
      }),
      User.countDocuments({
        isActive: true,
        createdAt: { $lt: lastMonth }
      })
    ]);

    // Get leads by month for the current year
    const currentYear = new Date().getFullYear();
    const leadsByMonth = await Lead.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Format the data for dashboard cards
    const dashboardStats = [
      {
        title: 'Total Projects',
        value: totalProjects.toString(),
        change: `${calculateChange(totalProjects, projectsLastMonth) >= 0 ? '+' : ''}${calculateChange(totalProjects, projectsLastMonth)}%`,
        trend: calculateChange(totalProjects, projectsLastMonth) >= 0 ? 'up' : 'down',
        icon: 'Building2',
        color: 'blue',
      },
      {
        title: 'Published Blogs',
        value: publishedBlogs.toString(),
        change: `${calculateChange(publishedBlogs, blogsLastMonth) >= 0 ? '+' : ''}${calculateChange(publishedBlogs, blogsLastMonth)}%`,
        trend: calculateChange(publishedBlogs, blogsLastMonth) >= 0 ? 'up' : 'down',
        icon: 'FileText',
        color: 'green',
      },
      {
        title: 'Active Users',
        value: totalUsers.toString(),
        change: `${calculateChange(totalUsers, usersLastMonth) >= 0 ? '+' : ''}${calculateChange(totalUsers, usersLastMonth)}%`,
        trend: calculateChange(totalUsers, usersLastMonth) >= 0 ? 'up' : 'down',
        icon: 'Users',
        color: 'purple',
      },
      {
        title: 'Total Testimonials',
        value: totalTestimonials.toString(),
        change: `${calculateChange(totalTestimonials, testimonialsLastMonth) >= 0 ? '+' : ''}${calculateChange(totalTestimonials, testimonialsLastMonth)}%`,
        trend: calculateChange(totalTestimonials, testimonialsLastMonth) >= 0 ? 'up' : 'down',
        icon: 'MessageSquare',
        color: 'amber',
      },
      {
        title: 'Total Leads',
        value: totalLeads.toString(),
        change: `${calculateChange(totalLeads, leadsLastMonth) >= 0 ? '+' : ''}${calculateChange(totalLeads, leadsLastMonth)}%`,
        trend: calculateChange(totalLeads, leadsLastMonth) >= 0 ? 'up' : 'down',
        icon: 'TrendingUp',
        color: 'indigo',
      },
      {
        title: 'New Leads Today',
        value: newLeadsToday.toString(),
        change: '+32%', // This would need more complex calculation for daily comparison
        trend: 'up',
        icon: 'UserPlus',
        color: 'red',
      },
    ];

    // Additional analytics data
    const analytics = {
      overview: {
        totalProjects,
        publishedBlogs,
        totalLeads,
        totalTestimonials,
        totalUsers,
        recentLeads,
        featuredProjects,
        newLeadsToday
      },
      projects: {
        byType: projectsByType.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byStatus: projectsByStatus.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      leads: {
        byStatus: leadsByStatus.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byMonth: leadsByMonth.map((item: any) => ({
          month: item._id,
          count: item.count
        }))
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        stats: dashboardStats,
        analytics,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(getStatsHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
