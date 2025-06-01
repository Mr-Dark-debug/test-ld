import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandling, withCors, AuthenticatedRequest } from '@/middleware/auth';
import { 
  parseFormData, 
  validateFile, 
  generateFileName, 
  processImage, 
  saveFile, 
  createThumbnail,
  FILE_CONFIGS 
} from '@/lib/upload';

// POST /api/upload - Upload files (admin only)
async function uploadHandler(req: AuthenticatedRequest) {
  try {
    const { fields, files } = await parseFormData(req);
    const uploadType = fields.type || 'image'; // image, brochure, video
    const generateThumbnails = fields.thumbnails === 'true';
    
    if (!['image', 'brochure', 'video'].includes(uploadType)) {
      return NextResponse.json(
        { error: 'Invalid upload type. Must be image, brochure, or video' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    
    // Process each file
    for (const [fieldName, fileArray] of Object.entries(files)) {
      for (const file of fileArray) {
        // Validate file
        const validation = validateFile(file, uploadType as keyof typeof FILE_CONFIGS);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        // Generate unique filename
        const filename = generateFileName(file.filename, uploadType);
        
        let filePath: string;
        let thumbnailPath: string | null = null;

        if (uploadType === 'image') {
          // Process and optimize image
          filePath = await processImage(file.buffer, filename, {
            width: 1920,
            height: 1080,
            quality: 85,
            format: 'webp'
          });

          // Generate thumbnail if requested
          if (generateThumbnails) {
            thumbnailPath = await createThumbnail(file.buffer, filename, 300);
          }
        } else {
          // Save file as-is for brochures and videos
          filePath = await saveFile(file.buffer, filename, uploadType as keyof typeof FILE_CONFIGS);
        }

        uploadedFiles.push({
          fieldName,
          originalName: file.filename,
          filename,
          path: filePath,
          thumbnailPath,
          size: file.size,
          type: file.mimetype
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

// DELETE /api/upload - Delete file (admin only)
async function deleteFileHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Import deleteFile function
    const { deleteFile } = await import('@/lib/upload');
    const deleted = await deleteFile(filePath);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
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
