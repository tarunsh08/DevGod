import { z } from "zod";
import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { hashPassword } from "../../../utils/hash.js";
import { generateAuthTokens } from "../../../utils/jwt.js";
import prisma from "../../../config/db.js";

export const registerUser = asyncHandler(async (req, res) => {
        const schema = z.object({
            name: z.string(),
            username: z.string(),
            email: z.string().email(),
            password: z.string()
        });

        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new ApiError(400, result.error.errors[0].message);
        }
        
        const { name, username, email, password } = result.data;

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({ data: { name, username, email, password: hashedPassword } });

        if (!user) {
            throw new ApiError(400, "User not created");
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


        return res.status(201).json(ApiResponse.success(
            { user: { email: user.email, name: user.name, role: user.role } }, 
            "User registered successfully",
            201
        ));
});