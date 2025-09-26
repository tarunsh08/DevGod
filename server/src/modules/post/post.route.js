import express from "express";
import { createPost } from "./controllers/createPost.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getAllPosts } from "./controllers/getAllPosts.controller.js";
import { toggleLike } from "./controllers/toggleLike.controller.js";

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getAllPosts);
router.post('/:postId/like', authenticate, toggleLike);

export default router;