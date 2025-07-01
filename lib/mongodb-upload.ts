import sharp from 'sharp';
import { NextRequest } from 'next/server';
import connectDB from './mongodb';
import Image from '@/models/Image';

// File type configurations
export const FILE_CONFIGS = {
  image: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    maxSize: 2 * 1024 * 1024, // 2MB limit
  }
};

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'webp';
  const baseName = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${random}.${extension}`;
}

/**
 * Validate file type and size
 */
export function validateFile(file: any): { valid: boolean; error?: string } {
  const config = FILE_CONFIGS.image;
  
  if (!config.allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`
    };
  }
  
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${config.maxSize / (1024 * 1024)}MB`
    };
  }
  
  return { valid: true };
}

/**
 * Process and save image to MongoDB
 */
export async function processAndSaveImage(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  size: number,
  userId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<{ success: boolean; imageId?: string; url?: string; error?: string }> {
  try {
    await connectDB();
    
    const {
      width = 1920,
      height = 1080,
      quality = 85,
      format = 'webp'
    } = options;
    
    // Process image with Sharp
    const processedBuffer = await sharp(buffer)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .toFormat(format, { quality })
      .toBuffer();
    
    // Get image metadata
    const metadata = await sharp(processedBuffer).metadata();
    
    // Convert to base64
    const base64Data = processedBuffer.toString('base64');
    
    // Generate filename
    const filename = generateFileName(originalName, 'img');
    
    // Save to MongoDB
    const imageDoc = new Image({
      filename,
      originalName,
      mimetype: `image/${format}`,
      size: processedBuffer.length,
      data: base64Data,
      uploadedBy: userId,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: format
      }
    });
    
    await imageDoc.save();
    
    return {
      success: true,
      imageId: imageDoc._id.toString(),
      url: `/api/images/${imageDoc._id}`
    };
    
  } catch (error) {
    console.error('Error processing and saving image:', error);
    return {
      success: false,
      error: 'Failed to process and save image'
    };
  }
}

/**
 * Parse multipart form data from NextRequest
 */
export async function parseFormData(request: NextRequest): Promise<{
  fields: Record<string, string>;
  files: Record<string, { buffer: Buffer; filename: string; mimetype: string; size: number }[]>;
}> {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  const files: Record<string, { buffer: Buffer; filename: string; mimetype: string; size: number }[]> = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const buffer = Buffer.from(await value.arrayBuffer());
      
      if (!files[key]) {
        files[key] = [];
      }
      
      files[key].push({
        buffer,
        filename: value.name,
        mimetype: value.type,
        size: value.size
      });
    } else {
      fields[key] = value as string;
    }
  }
  
  return { fields, files };
}

/**
 * Delete image from MongoDB
 */
export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await Image.findByIdAndDelete(imageId);
    return !!result;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Get image by ID
 */
export async function getImageById(imageId: string) {
  try {
    await connectDB();
    const image = await Image.findById(imageId);
    return image;
  } catch (error) {
    console.error('Error getting image:', error);
    return null;
  }
}

/**
 * Extract Google Maps embed URL from iframe
 */
export function extractGoogleMapsUrl(iframeHtml: string): string | null {
  try {
    // Extract src attribute from iframe
    const srcMatch = iframeHtml.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      const url = srcMatch[1];
      // Validate that it's a Google Maps embed URL
      if (url.includes('google.com/maps/embed')) {
        return url;
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting Google Maps URL:', error);
    return null;
  }
}

/**
 * Validate Google Maps embed URL
 */
export function validateGoogleMapsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.google.com' && urlObj.pathname.startsWith('/maps/embed');
  } catch {
    return false;
  }
}
