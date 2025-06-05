import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Amenity from '@/models/Amenity';
import User from '@/models/User';
import { validateRequest, updateProjectSchema } from '@/lib/validation';

// Ensure models are registered
const ensureModelsRegistered = () => {
  try {
    // Import models to ensure they are registered
    require('@/models/User');
    require('@/models/Project');
    require('@/models/Amenity');
  } catch (error) {
    console.log('Models already registered or error:', error);
  }
};

// GET /api/projects/[slug] - Get single project by slug
async function getProjectHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    // Ensure all models are registered
    ensureModelsRegistered();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }

  try {
    const { slug } = await params;
    console.log(`Looking for project with slug: ${slug}`);

    const project = await Project.findOne({ slug })
      .populate('amenities', 'name icon category description')
      .populate('createdBy', 'name email')
      .lean();

    console.log(`Project found: ${project ? 'Yes' : 'No'}`);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[slug] - Update project (admin only)
async function updateProjectHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  try {
    const { slug } = await params;
    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body, updateProjectSchema);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const project = await Project.findOneAndUpdate(
      { slug },
      validation.value,
      { new: true, runValidators: true }
    )
      .populate('amenities', 'name icon category description')
      .populate('createdBy', 'name email');

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

// DELETE /api/projects/[slug] - Delete project (admin only)
async function deleteProjectHandler(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  try {
    const { slug } = await params;

    const project = await Project.findOneAndDelete({ slug });

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

// Export the handlers
export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return getProjectHandler(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return updateProjectHandler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  return deleteProjectHandler(req, context);
}
