import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV,
        path: '/api/v1/auth/refresh-token'
    });
    return res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});