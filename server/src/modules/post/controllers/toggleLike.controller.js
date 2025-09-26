import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import prisma from "../../../config/db.js";
import asyncHandler from '../../../utils/asyncHandler.js';


export const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if(!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if(!post) {
        throw new ApiError(404, "Post not found")
    }

    const existingLike = await prisma.like.findUnique({
        where: {
            postId,
            userId
        }
    })

    if(existingLike) {
        await prisma.like.delete({
            where: {
                id: existingLike.id
            }
        })

        await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likesCount: {
                    decrement: 1
                }
            }
        })
        return res.status(200).json(
            new ApiResponse(200, { isLiked: false }, 'Post unliked successfully')
        )
    }else{
        await prisma.like.create({
            data: {
                postId,
                userId
            }
        })

        await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likesCount: {
                    increment: 1
                }
            }
        })
        return res.status(200).json(
            new ApiResponse(200, { isLiked: true }, 'Post liked successfully')
        )
    }
})