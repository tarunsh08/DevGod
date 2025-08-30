import { verifyAccessToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.accessToken;
        
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        // Verify token
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            throw new ApiError(401, "Unauthorized: Invalid token");
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };

        next();
    } catch (error) {
        // Clear invalid tokens
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            throw new ApiError(401, 'Session expired. Please log in again.');
        }
        throw error;
    }
});

// Role-based access control middleware
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(403, 'Forbidden: You do not have permission to access this resource');
        }
        next();
    };
};
