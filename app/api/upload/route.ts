import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import {
  parseFormData,
  validateFile,
  processAndSaveImage
} from '@/lib/mongodb-upload';

// POST /api/upload - Upload images (admin only)
async function uploadHandler(req: AuthenticatedRequest) {
  try {
    const { fields, files } = await parseFormData(req);
    const uploadType = fields.type || 'image';

    // Only support image uploads now
    if (uploadType !== 'image') {
      return NextResponse.json(
        { error: 'Only image uploads are supported. Use URL links for other file types.' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    // Process each file
    for (const [fieldName, fileArray] of Object.entries(files)) {
      for (const file of fileArray) {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        // Process and save image to MongoDB
        const result = await processAndSaveImage(
          file.buffer,
          file.filename,
          file.mimetype,
          file.size,
          req.user!.userId,
          {
            width: 1920,
            height: 1080,
            quality: 85,
            format: 'webp'
          }
        );

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Failed to upload image' },
            { status: 500 }
          );
        }

        uploadedFiles.push({
          fieldName,
          originalName: file.filename,
          filename: result.imageId,
          path: result.url,
          thumbnailPath: null,
          size: file.size,
          type: file.mimetype,
          imageId: result.imageId
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image (admin only)
async function deleteFileHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const { deleteImage } = await import('@/lib/mongodb-upload');
    const deleted = await deleteImage(imageId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// Route handlers
export const POST = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(uploadHandler);

export const DELETE = withMiddleware(
  withCors,
  withAuth,
  withErrorHandling
)(deleteFileHandler);

// Helper function to combine middlewares
function withMiddleware(...middlewares: Array<(handler: any) => any>) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
