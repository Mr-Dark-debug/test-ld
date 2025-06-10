/**
 * Model Registration Utility
 * Ensures all Mongoose models are properly registered to prevent MissingSchemaError
 */

// Import all models to ensure they are registered
import User from '@/models/User';
import BlogPost from '@/models/BlogPost';
import Project from '@/models/Project';
import Testimonial from '@/models/Testimonial';
import ContactUs from '@/models/ContactUs';
import AboutUs from '@/models/AboutUs';
import Amenity from '@/models/Amenity';
import { JobOpening, JobApplication } from '@/models/Career';
import Lead from '@/models/Lead';

/**
 * Ensures all models are registered with Mongoose
 * Call this function before performing any database operations
 */
export function ensureModelsRegistered() {
  // Models are automatically registered when imported
  // This function serves as a central place to ensure all models are loaded
  const models = {
    User,
    BlogPost,
    Project,
    Testimonial,
    ContactUs,
    AboutUs,
    Amenity,
    JobOpening,
    JobApplication,
    Lead,
  };

  // Log registered models in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📋 Registered models:', Object.keys(models));
  }

  return models;
}

/**
 * Get a specific model by name
 */
export function getModel(name: string) {
  const models = ensureModelsRegistered();
  return models[name as keyof typeof models];
}

export default ensureModelsRegistered;
