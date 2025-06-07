import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Amenity from '@/models/Amenity';
import User from '@/models/User';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest, withOptionalAuth } from '@/middleware/auth';
import { validateRequest, createProjectSchema, partialUpdateProjectSchema } from '@/lib/validation';

// GET /api/projects - Get all projects with optional filtering
async function getProjectsHandler(req: AuthenticatedRequest) {
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
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const id = searchParams.get('id'); // Add support for getting by ID

    // Build query
    const query: any = {};

    // If ID is provided, search by ID only
    if (id) {
      try {
        query._id = id;
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid project ID' },
          { status: 400 }
        );
      }
    } else {
      // Apply other filters only if not searching by ID
      if (type && ['residential', 'commercial'].includes(type)) {
        query.type = type;
      }

      if (status && ['ongoing', 'completed', 'upcoming'].includes(status)) {
        query.status = status;
      }

      if (featured === 'true') {
        query.featured = true;
      }

      if (city) {
        query['location.city'] = new RegExp(city, 'i');
      }

      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { 'location.address': new RegExp(search, 'i') }
        ];
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Projects query:', query);
    console.log('Pagination:', { page, limit, skip });

    // Execute query without population for now (to avoid schema registration issues)
    const startTime = Date.now();
    const projects = await Project.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${projects.length} projects in ${Date.now() - startTime}ms`);

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (admin only)
async function createProjectHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body, createProjectSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Ensure validation.value is not undefined before spreading
    if (!validation.value || typeof validation.value !== 'object') {
      return NextResponse.json(
        { error: 'Invalid project data structure' },
        { status: 400 }
      );
    }

    const validatedData = validation.value as any;

    // Transform the data to match the database schema
    const projectData = {
      title: validatedData.title,
      category: validatedData.category,
      status: validatedData.status,
      description: validatedData.description,
      location: {
        address: validatedData.location?.address || '',
        lat: validatedData.location?.lat || '',
        lng: validatedData.location?.lng || '',
        mapEmbedUrl: validatedData.location?.mapEmbedUrl || ''
      },
      images: {
        coverImage: validatedData.coverImage || validatedData.images?.coverImage || '',
        gallery: {
          promotional: validatedData.images?.gallery?.promotional || [],
          exterior: validatedData.images?.gallery?.exterior || [],
          interior: validatedData.images?.gallery?.interior || [],
          videos: validatedData.images?.gallery?.videos || []
        }
      },
      specifications: {
        totalUnits: validatedData.specifications?.totalUnits || '',
        unitTypes: validatedData.specifications?.unitTypes || '',
        unitArea: validatedData.specifications?.unitArea || '',
        possession: validatedData.specifications?.possession || '',
        structure: validatedData.specifications?.structure || '',
        flooring: validatedData.specifications?.flooring || ''
      },
      floorPlans: {
        '1bhk': [],
        '2bhk': [],
        '3bhk': validatedData.floorPlans?.['3bhk'] || [],
        '4bhk': validatedData.floorPlans?.['4bhk'] || [],
        '5bhk': validatedData.floorPlans?.['5bhk'] || []
      },
      amenities: validatedData.amenities || [],
      reraNumber: validatedData.reraNumber || '',
      reraQrImage: validatedData.reraQrImage || '',
      brochureUrl: validatedData.brochureUrl || '',
      brochureFile: validatedData.brochureFile || '',
      modelView: validatedData.modelView || '',
      coverImage: validatedData.coverImage || '',
      contactSales: validatedData.contactSales || '',
      featured: validatedData.featured || false,
      seoMeta: validatedData.seoMeta || {},
      createdBy: req.user!.userId
    };

    const project = await Project.create(projectData);

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: project
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update project (admin only)
async function updateProjectHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate request body using partial update schema
    const validation = validateRequest(body, partialUpdateProjectSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Ensure validation.value is not undefined before spreading
    if (!validation.value || typeof validation.value !== 'object') {
      return NextResponse.json(
        { error: 'Invalid project data structure' },
        { status: 400 }
      );
    }

    // Extract id from validated data and use the rest for update
    const { id: validatedId, ...updateFields } = validation.value;

    // If title is being updated, generate new slug
    if (updateFields.title) {
      updateFields.slug = updateFields.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        ...updateFields,
        updatedAt: new Date()
      },
      { new: true, runValidators: false } // Disable mongoose validation since we already validated
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Update project error:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'A project with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete project (admin only)
async function deleteProjectHandler(req: AuthenticatedRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

// Route handlers
export const GET = withMiddleware(
  withCors,
  withOptionalAuth,
  withErrorHandling
)(getProjectsHandler);

export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(createProjectHandler);

export const PUT = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(updateProjectHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteProjectHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
