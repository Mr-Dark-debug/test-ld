import Joi from 'joi';

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
  type: Joi.string().valid('residential', 'commercial').required(),
  status: Joi.string().valid('ongoing', 'completed', 'upcoming').required(),
  description: Joi.string().min(10).required(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  specifications: Joi.object({
    totalUnits: Joi.string().required(),
    unitTypes: Joi.string().required(),
    unitArea: Joi.string().required(),
    possession: Joi.string().required(),
    structure: Joi.string().required(),
    flooring: Joi.string().required()
  }).required(),
  reraNumber: Joi.string().required(),
  contactSales: Joi.string().required(),
  amenities: Joi.array().items(Joi.string().hex().length(24)).default([]),
  featured: Joi.boolean().default(false),
  seoMeta: Joi.object({
    title: Joi.string().max(60),
    description: Joi.string().max(160),
    keywords: Joi.array().items(Joi.string())
  }).optional()
});

export const updateProjectSchema = createProjectSchema.fork(
  ['title', 'type', 'status', 'description', 'location', 'specifications', 'reraNumber', 'contactSales'],
  (schema) => schema.optional()
);

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
  designation: Joi.string().max(50).optional(),
  company: Joi.string().max(50).optional(),
  content: Joi.string().min(10).max(500).required(),
  rating: Joi.number().min(1).max(5).required(),
  projectId: Joi.string().hex().length(24).optional(),
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
  excerpt: Joi.string().min(10).max(200).required(),
  content: Joi.string().min(50).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
  author: Joi.object({
    name: Joi.string().required(),
    avatar: Joi.string().optional()
  }).required(),
  seoMeta: Joi.object({
    title: Joi.string().max(60),
    description: Joi.string().max(160),
    keywords: Joi.array().items(Joi.string())
  }).optional()
});

export const updateBlogSchema = createBlogSchema.fork(
  ['title', 'excerpt', 'content', 'category', 'author'],
  (schema) => schema.optional()
);

// Lead validation schemas
export const contactLeadSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/).required(),
  projectInterest: Joi.string().optional(),
  message: Joi.string().max(500).required()
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
