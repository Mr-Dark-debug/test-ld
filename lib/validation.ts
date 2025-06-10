import Joi from 'joi';
import { VALIDATION_CONFIG } from './config';

// User validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('super_admin', 'admin', 'editor').default('editor')
});

// Project validation schemas
export const createProjectSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('residential', 'commercial').required(),
  status: Joi.string().valid('ongoing', 'completed', 'upcoming').required(),
  description: Joi.string().min(10).required(),
  location: Joi.object({
    address: Joi.string().allow('').optional(),
    lat: Joi.string().allow('').optional(),
    lng: Joi.string().allow('').optional(),
    mapEmbedUrl: Joi.string().uri().allow('').optional()
  }).optional(),
  specifications: Joi.object({
    totalUnits: Joi.string().allow('').optional(),
    unitTypes: Joi.string().allow('').optional(),
    unitArea: Joi.string().allow('').optional(),
    possession: Joi.string().allow('').optional(),
    structure: Joi.string().allow('').optional(),
    flooring: Joi.string().allow('').optional()
  }).optional(),
  reraNumber: Joi.string().allow('').optional(),
  contactSales: Joi.string().allow('').optional(),
  amenities: Joi.array().items(Joi.string()).default([]),
  featured: Joi.boolean().default(false),
  // Image and file fields
  coverImage: Joi.string().allow('').optional(),
  images: Joi.object({
    coverImage: Joi.string().allow('').optional(),
    gallery: Joi.object({
      promotional: Joi.array().items(Joi.string()).default([]),
      exterior: Joi.array().items(Joi.string()).default([]),
      interior: Joi.array().items(Joi.string()).default([]),
      videos: Joi.array().items(Joi.string()).default([])
    }).optional()
  }).optional(),
  floorPlans: Joi.object({
    '3bhk': Joi.array().items(Joi.string()).default([]),
    '4bhk': Joi.array().items(Joi.string()).default([]),
    '5bhk': Joi.array().items(Joi.string()).default([])
  }).optional(),
  reraQrImage: Joi.string().allow('').optional(),
  brochureUrl: Joi.string().uri().allow('').optional(),
  brochureFile: Joi.string().allow('').optional(),
  modelView: Joi.string().allow('').optional(),
  seoMeta: Joi.object({
    title: Joi.string().max(60),
    description: Joi.string().max(160),
    keywords: Joi.array().items(Joi.string())
  }).optional()
});

export const updateProjectSchema = createProjectSchema.fork(
  ['title', 'category', 'status', 'description', 'location', 'specifications', 'reraNumber', 'contactSales', 'amenities', 'featured', 'coverImage', 'images', 'floorPlans', 'reraQrImage', 'brochureUrl', 'brochureFile', 'modelView'],
  (schema) => schema.optional()
);

// Schema for partial project updates (like featured toggle)
export const partialUpdateProjectSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(2).max(100).optional(),
  category: Joi.string().valid('residential', 'commercial').optional(),
  status: Joi.string().valid('upcoming', 'ongoing', 'completed').optional(),
  description: Joi.string().min(10).optional(),
  location: Joi.object({
    address: Joi.string().allow('').optional(),
    lat: Joi.string().allow('').optional(),
    lng: Joi.string().allow('').optional(),
    mapEmbedUrl: Joi.string().uri().allow('').optional()
  }).optional(),
  specifications: Joi.object({
    totalUnits: Joi.string().allow('').optional(),
    unitTypes: Joi.string().allow('').optional(),
    unitArea: Joi.string().allow('').optional(),
    possession: Joi.string().allow('').optional(),
    structure: Joi.string().allow('').optional(),
    flooring: Joi.string().allow('').optional()
  }).optional(),
  reraNumber: Joi.string().allow('').optional(),
  contactSales: Joi.string().allow('').optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  featured: Joi.boolean().optional(),
  // Image and file fields
  coverImage: Joi.string().allow('').optional(),
  images: Joi.object({
    coverImage: Joi.string().allow('').optional(),
    gallery: Joi.object({
      promotional: Joi.array().items(Joi.string()).optional(),
      exterior: Joi.array().items(Joi.string()).optional(),
      interior: Joi.array().items(Joi.string()).optional(),
      videos: Joi.array().items(Joi.string()).optional()
    }).optional()
  }).optional(),
  floorPlans: Joi.object({
    '3bhk': Joi.array().items(Joi.string()).optional(),
    '4bhk': Joi.array().items(Joi.string()).optional(),
    '5bhk': Joi.array().items(Joi.string()).optional()
  }).optional(),
  reraQrImage: Joi.string().allow('').optional(),
  brochureUrl: Joi.string().uri().allow('').optional(),
  brochureFile: Joi.string().allow('').optional(),
  modelView: Joi.string().allow('').optional()
});

// Amenity validation schemas
export const createAmenitySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  icon: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().max(200).optional(),
  isActive: Joi.boolean().default(true)
});

export const updateAmenitySchema = createAmenitySchema.fork(
  ['name', 'icon', 'category'],
  (schema) => schema.optional()
);

// Testimonial validation schemas
export const createTestimonialSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  designation: Joi.string().max(50).allow('').optional(),
  company: Joi.string().max(50).allow('').optional(),
  content: Joi.string().min(10).max(500).required(),
  rating: Joi.number().min(1).max(5).required(),
  image: Joi.string().uri().allow('').optional(),
  youtubeUrl: Joi.alternatives().try(
    Joi.string().pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}.*$/),
    Joi.string().allow('')
  ).optional(),
  isApproved: Joi.boolean().default(false),
  isFeatured: Joi.boolean().default(false)
});

export const updateTestimonialSchema = createTestimonialSchema.fork(
  ['name', 'content', 'rating'],
  (schema) => schema.optional()
);

// Blog post validation schemas
export const createBlogSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  slug: Joi.string().optional(),
  excerpt: Joi.string().min(10).max(200).required(),
  content: Joi.string().min(50).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published', 'archived', 'scheduled').default('draft'),
  coverImage: Joi.string().allow('').optional(),
  publishDate: Joi.alternatives().try(
    Joi.date(),
    Joi.string().allow('').optional()
  ).optional(),
  publishedAt: Joi.alternatives().try(
    Joi.date(),
    Joi.string().allow('').optional()
  ).optional(),
  author: Joi.object({
    name: Joi.string().required(),
    avatar: Joi.string().allow('').optional()
  }).required(),
  seoMeta: Joi.object({
    title: Joi.string().max(60),
    description: Joi.string().max(160),
    keywords: Joi.array().items(Joi.string())
  }).optional(),
  readingTime: Joi.number().optional()
});

export const updateBlogSchema = createBlogSchema.fork(
  ['title', 'slug', 'excerpt', 'content', 'category', 'author', 'tags', 'status', 'coverImage', 'publishDate', 'publishedAt', 'seoMeta', 'readingTime'],
  (schema) => schema.optional()
);

// Lead validation schemas
export const contactLeadSchema = Joi.object({
  name: Joi.string().min(VALIDATION_CONFIG.NAME_MIN_LENGTH).max(VALIDATION_CONFIG.NAME_MAX_LENGTH).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(VALIDATION_CONFIG.PHONE_PATTERN).required(),
  projectInterest: Joi.string().optional(),
  message: Joi.string().max(VALIDATION_CONFIG.MESSAGE_MAX_LENGTH).required()
});

export const brochureLeadSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/).required(),
  projectId: Joi.string().hex().length(24).required()
});

export const careerApplicationSchema = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/).required(),
  experience: Joi.string().required(),
  message: Joi.string().max(500).optional()
});

// File upload validation
export const fileUploadSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  mimetype: Joi.string().valid(
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4'
  ).required(),
  size: Joi.number().max(50 * 1024 * 1024).required() // 50MB max
});

/**
 * Validate request body against a schema
 */
export function validateRequest<T>(data: any, schema: Joi.ObjectSchema): { error?: string; value?: T } {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return { error: errorMessage };
  }
  
  return { value };
}

/**
 * Middleware function to validate request body
 */
export function createValidationMiddleware(schema: Joi.ObjectSchema) {
  return (data: any) => {
    const result = validateRequest(data, schema);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.value;
  };
}
