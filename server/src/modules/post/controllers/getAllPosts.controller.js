import asyncHandler from "../../../utils/asyncHandler.js";
import prisma from "../../../config/db.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import ApiError from "../../../utils/ApiError.js";

export const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await prisma.post.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true
                }
            }
        }
    });

    if (!posts) {
        throw new ApiError(404, 'Posts not found');
    }

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(new ApiResponse(200, { posts }, 'Posts fetched successfully'));
});