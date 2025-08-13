import 'dotenv/config'
import express from 'express'
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

// Example protected route handler
export const protectedRoute = (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    // You can add additional checks here if needed
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default requireAuth()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

const app = express()

app.get('/protected', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req)

    const user = await requireAuth().clerkClient.users.getUser(userId)

    return res.json({ user })
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
})