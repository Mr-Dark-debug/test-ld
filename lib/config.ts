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
  bufferCommands: false, // Disable mongoose buffering for better error handling
  connectTimeoutMS: 10000, // Reduced from 30s to 10s
  socketTimeoutMS: 20000, // Reduced from 45s to 20s
  serverSelectionTimeoutMS: 10000, // Reduced from 30s to 10s
  maxPoolSize: 5, // Reduced from 10 to 5 for production
  minPoolSize: 1,
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000,
  heartbeatFrequencyMS: 10000,
} as const;

// Helper function to get the full API URL
export function getApiUrl(endpoint: string = ''): string {
  let apiPath = FRONTEND_CONFIG.API_URL; // e.g., /api or https://api.example.com
  let baseUrl = FRONTEND_CONFIG.BASE_URL; // e.g., https://app.example.com or http://localhost:3000

  // Normalize slashes
  const normalizeSlash = (str: string, type: 'leading' | 'trailing' | 'both') => {
    if (type === 'leading') return str.startsWith('/') ? str : `/${str}`;
    if (type === 'trailing') return str.endsWith('/') ? str : `${str}/`;
    if (type === 'both') {
      str = str.startsWith('/') ? str : `/${str}`;
      return str.endsWith('/') ? str : `${str}/`;
    }
    return str;
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

  // Case 1: apiPath is an absolute URL (e.g., https://api.example.com)
  if (apiPath.startsWith('http')) {
    // Ensure apiPath has a trailing slash and endpoint does not have a leading one
    apiPath = normalizeSlash(apiPath, 'trailing');
    return `${apiPath}${cleanEndpoint}`;
  }

  // Case 2: apiPath is relative (e.g., /api) - implies same-origin or relative to a defined BASE_URL
  // For same-origin API calls (like /api/activities), we want to ensure they are truly same-origin
  // and not prefixed with an external BASE_URL which can cause CORS issues.
  // The initial problem indicates `logActivity` (which uses this function) tries to call
  // `https://www.laxmideveloper.com//api/activities` from `https://laxmidev-git-main-laxmidev-projects.vercel.app`.
  // This happens if BASE_URL is `https://www.laxmideveloper.com/` and API_URL is `/api`.

  // If API_URL is relative (e.g. /api), it should be treated as same-origin.
  // We should not prepend `FRONTEND_CONFIG.BASE_URL` if it points to a *different* origin
  // than the current window.location.origin, as this is the source of the CORS issue.
  // However, modifying this behavior based on window.location.origin directly in this
  // shared config function can be tricky and might have unintended side effects for server-side rendering.

  // A more robust approach for relative apiPaths:
  // If apiPath starts with '/', it's intended to be relative to the *current* domain.
  // If NEXT_PUBLIC_BASE_URL is set to an external domain (like www.laxmideveloper.com),
  // and API_URL is relative (like /api), we must ensure the call remains same-origin.
  // The simplest way to ensure same-origin for /api/* calls is to just use them as is.
  if (apiPath.startsWith('/')) {
    // This is a path like /api. It should be relative to the current host.
    // Example: /api + activities -> /api/activities
    let finalApiPath = apiPath.endsWith('/') ? apiPath.slice(0, -1) : apiPath; // remove trailing slash from apiPath
    return `${finalApiPath}/${cleanEndpoint}`;
  }

  // Fallback: If apiPath is not absolute and not starting with '/', prepend baseUrl.
  // This case is less likely for typical /api setups.
  // Ensure baseUrl has a trailing slash, apiPath has neither, and endpoint has no leading.
  baseUrl = normalizeSlash(baseUrl, 'trailing');
  apiPath = apiPath.startsWith('/') ? apiPath.substring(1) : apiPath;
  apiPath = apiPath.endsWith('/') ? apiPath.slice(0, -1) : apiPath;

  return `${baseUrl}${apiPath}/${cleanEndpoint}`;
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
