import asyncHandler from "../../../utils/asyncHandler.js";
import prisma from "../../../config/db.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import ApiError from "../../../utils/ApiError.js";
import { verifyAccessToken } from "../../../utils/jwt.js";

export const createPost = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        useCase,
        howToUse,
        techStack,
        category,
        demoLink,
        repoLink,
        images,
        accessToken
    } = req.body;

    if (!title || !description || !useCase || !howToUse || !category) {
        throw new ApiError(400, 'Missing required fields');
    }

    if (!Array.isArray(techStack)) {
        throw new ApiError(400, 'techStack must be an array');
    }

    if (images && !Array.isArray(images)) {
        throw new ApiError(400, 'images must be an array');
    }

    const post = await prisma.post.create({
        data: {
            title,
            description,
            useCase,
            howToUse,
            techStack: techStack || [],
            category,
            demoLink: demoLink || '',
            repoLink: repoLink || '',
            images: images || [],
            userId: verifyAccessToken(accessToken)?.id || req.user?.id
        },
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

    if (!post) {
        throw new ApiError(400, 'Failed to create post');
    }

    return res.status(201).json(new ApiResponse(201, { post }, 'Post created successfully'));
});