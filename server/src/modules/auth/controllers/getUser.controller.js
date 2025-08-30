import asyncHandler from "../../../utils/asyncHandler.js";
import prisma from "../../../config/db.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import ApiError from "../../../utils/ApiError.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authenticated');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id 
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        throw new ApiError(404, 'User not found');
    }

    return res.status(200).json(
        new ApiResponse(200, { user }, 'User fetched successfully')
    );
});