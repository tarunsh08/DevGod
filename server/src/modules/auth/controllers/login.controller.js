import { z } from "zod";
import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import prisma from "../../../config/db.js";
import { comparePassword } from "../../../utils/hash.js";
import { generateAuthTokens } from "../../../utils/jwt.js";

export const loginUser = asyncHandler(async (req, res) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        throw new ApiError(400, result.error.errors[0].message);
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.cookie("accessToken", accessToken,
        {
            httpOnly: true, sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            secure: process.env.NODE_ENV
        }
    );
    res.cookie("refreshToken", refreshToken,
        {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV
        }
    );

    return res.status(200).json(ApiResponse.success(
        { user: { email: user.email, name: user.name, role: user.role, accessToken } },
        "Login successful"
    ));
});
