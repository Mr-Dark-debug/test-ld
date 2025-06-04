/**
 * Application Configuration
 * Centralized configuration management for environment variables
 */

// Server Configuration
export const SERVER_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/laxmidev',
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '50000000', 10), // 50MB default
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'public/uploads',
} as const;

// Frontend Configuration (Client-side accessible)
export const FRONTEND_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}` 
      : `http://localhost:${SERVER_CONFIG.PORT}`),
} as const;

// API Configuration
export const API_CONFIG = {
  RATE_LIMIT: {
    CONTACT_FORM: {
      MAX_REQUESTS: 10,
      WINDOW_MS: 5 * 60 * 1000, // 5 minutes
    },
    GENERAL: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    },
  },
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  PHONE_PATTERN: /^[+]?[0-9\s\-\(\)]{8,25}$/,
  EMAIL_PATTERN: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MAX_LENGTH: 500,
} as const;

// MongoDB Connection Options
export const MONGODB_OPTIONS = {
  bufferCommands: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000,
  heartbeatFrequencyMS: 10000,
} as const;

// Helper function to get the full API URL
export function getApiUrl(endpoint: string = ''): string {
  const baseUrl = FRONTEND_CONFIG.BASE_URL;
  const apiPath = FRONTEND_CONFIG.API_URL;
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Construct full URL
  if (apiPath.startsWith('http')) {
    // Absolute URL
    return `${apiPath}/${cleanEndpoint}`;
  } else {
    // Relative URL
    return `${baseUrl}${apiPath}/${cleanEndpoint}`;
  }
}

// Helper function to check if we're in development
export const isDevelopment = () => SERVER_CONFIG.NODE_ENV === 'development';

// Helper function to check if we're in production
export const isProduction = () => SERVER_CONFIG.NODE_ENV === 'production';

// Export all configs as a single object for convenience
export const CONFIG = {
  SERVER: SERVER_CONFIG,
  DATABASE: DATABASE_CONFIG,
  UPLOAD: UPLOAD_CONFIG,
  FRONTEND: FRONTEND_CONFIG,
  API: API_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  MONGODB_OPTIONS,
} as const;

export default CONFIG;
