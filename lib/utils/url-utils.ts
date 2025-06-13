/**
 * Utility to get the base URL for API requests
 * 
 * Server components need to use absolute URLs for fetch
 * This utility helps standardize the base URL construction
 */
export function getBaseUrl() {
  // Check if we're in a browser or server environment
  if (typeof window !== 'undefined') {
    // Browser should use the origin
    return window.location.origin;
  }
  
  // Server should use the environment variable or fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
