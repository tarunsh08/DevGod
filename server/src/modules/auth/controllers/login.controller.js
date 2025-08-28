import { z } from "zod";
import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

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

        return res.status(200).json(ApiResponse.success(
            { email }, 
            "Login successful"
        ));
});
