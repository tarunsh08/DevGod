import 'dotenv/config'
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'

// Require authentication for protected routes
export const requireAuth = ClerkExpressRequireAuth({
  // Add any custom error handling or configuration here
  onError: (err) => {
    console.error('Clerk auth error:', err);
    throw new Error('Not authenticated');
  }
});

// Get authentication state without requiring it
export const withAuth = ClerkExpressWithAuth({
  // Add any custom configuration here
});

// Helper to get auth data from request
export const getAuth = (req) => {
  if (!req.auth) {
    throw new Error('Auth not found in request');
  }
  return req.auth;
};

// Helper to get Clerk user ID from request
export const getClerkUserId = (req) => {
  return req.auth?.userId || null;
};

// Export requireAuth as clerk for route middleware
export const clerk = requireAuth;

export default requireAuth;