import express from "express";
import { listProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { clerk } from "../middleware/clerkMiddleware.js";

const router = express.Router();

router.get("/", listProjects);
router.get("/:id", getProject);
router.post("/", clerk, createProject);
router.put("/:id", clerk, updateProject);
router.delete("/:id", clerk, deleteProject);

export default router;