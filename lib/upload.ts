import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { NextRequest } from 'next/server';

// Ensure upload directories exist
const UPLOAD_BASE_DIR = process.env.UPLOAD_PATH || 'public/uploads';
const UPLOAD_DIRS = {
  images: path.join(UPLOAD_BASE_DIR, 'images'),
  brochures: path.join(UPLOAD_BASE_DIR, 'brochures'),
  videos: path.join(UPLOAD_BASE_DIR, 'videos'),
  temp: path.join(UPLOAD_BASE_DIR, 'temp')
};

// Create upload directories if they don't exist
export async function ensureUploadDirs() {
  for (const dir of Object.values(UPLOAD_DIRS)) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// File type configurations
export const FILE_CONFIGS = {
  image: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024, // 2MB limit as requested
    directory: UPLOAD_DIRS.images
  },
  brochure: {
    allowedTypes: ['application/pdf'],
    maxSize: 20 * 1024 * 1024, // 20MB
    directory: UPLOAD_DIRS.brochures
  },
  video: {
    allowedTypes: ['video/mp4', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    directory: UPLOAD_DIRS.videos
  }
};

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${prefix ? prefix + '_' : ''}${baseName}_${timestamp}_${random}${extension}`;
}

/**
 * Validate file type and size
 */
export function validateFile(file: any, type: keyof typeof FILE_CONFIGS): { valid: boolean; error?: string } {
  const config = FILE_CONFIGS[type];
  
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
 * Process and save image file
 */
export async function processImage(
  buffer: Buffer,
  filename: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<string> {
  await ensureUploadDirs();
  
  const {
    width = 1920,
    height = 1080,
    quality = 85,
    format = 'webp'
  } = options;
  
  const processedFilename = filename.replace(/\.[^/.]+$/, `.${format}`);
  const outputPath = path.join(UPLOAD_DIRS.images, processedFilename);
  
  await sharp(buffer)
    .resize(width, height, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .toFormat(format, { quality })
    .toFile(outputPath);
  
  return `/uploads/images/${processedFilename}`;
}

/**
 * Save file to appropriate directory
 */
export async function saveFile(
  buffer: Buffer,
  filename: string,
  type: keyof typeof FILE_CONFIGS
): Promise<string> {
  await ensureUploadDirs();
  
  const config = FILE_CONFIGS[type];
  const outputPath = path.join(config.directory, filename);
  
  await fs.writeFile(outputPath, buffer);
  
  const urlPath = config.directory.replace('public', '').replace(/\\/g, '/');
  return `${urlPath}/${filename}`;
}

/**
 * Delete file from filesystem
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join('public', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Create thumbnail for image
 */
export async function createThumbnail(
  buffer: Buffer,
  filename: string,
  size: number = 300
): Promise<string> {
  await ensureUploadDirs();
  
  const thumbnailFilename = filename.replace(/\.[^/.]+$/, '_thumb.webp');
  const outputPath = path.join(UPLOAD_DIRS.images, thumbnailFilename);
  
  await sharp(buffer)
    .resize(size, size, { 
      fit: 'cover',
      position: 'center'
    })
    .toFormat('webp', { quality: 80 })
    .toFile(outputPath);
  
  return `/uploads/images/${thumbnailFilename}`;
}

/**
 * Get file info
 */
export async function getFileInfo(filePath: string) {
  try {
    const fullPath = path.join('public', filePath);
    const stats = await fs.stat(fullPath);
    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime
    };
  } catch (error) {
    return { exists: false };
  }
}

/**
 * Clean up old temporary files
 */
export async function cleanupTempFiles(olderThanHours: number = 24): Promise<void> {
  try {
    const tempDir = UPLOAD_DIRS.temp;
    const files = await fs.readdir(tempDir);
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime.getTime() < cutoffTime) {
        await fs.unlink(filePath);
        console.log(`Cleaned up temp file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
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
