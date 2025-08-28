import express from "express";
import { registerUser } from "./controllers/register.controller.js";
import { loginUser } from "./controllers/login.controller.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;