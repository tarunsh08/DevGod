import express from "express";
import { registerUser } from "./controllers/register.controller.js";
import { loginUser } from "./controllers/login.controller.js";
import { logoutUser } from "./controllers/logout.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getCurrentUser } from "./controllers/getUser.controller.js";

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logoutUser);

export default router;