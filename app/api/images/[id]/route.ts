import { NextRequest, NextResponse } from 'next/server';
import { getImageById } from '@/lib/mongodb-upload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }
    
    const image = await getImageById(imageId);
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Convert base64 back to buffer
    const buffer = Buffer.from(image.data, 'base64');
    
    // Return image with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': image.mimetype,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'ETag': `"${image._id}"`,
      },
    });
    
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
