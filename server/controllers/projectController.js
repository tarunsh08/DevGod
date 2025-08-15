import prisma from "../prisma/client.js";
import { getClerkUserId } from "../middleware/clerkMiddleware.js";

export const listProjects = async (req, res) => {
    try {
        const { search, category, tag, page=1, limit=12 } = req.query;
        const where = {};

        if(category) where.category = category;
        if(search) {
            where.OR = [
                { title: {
                    contains: search,
                    mode: "insensitive"
                }},
                { description: {
                    contains: search,
                    mode: "insensitive"
                }},
                { useCase: {
                    contains: search,
                    mode: "insensitive"
                }}
            ];
        }

        const take = Math.min(Number(limit) || 12, 100);
        const skip = (Math.max(Number(page) || 1, 1) -1) * take;

        const [total, projects] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        socialLinks: true
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        return res.json({
            data: projects,
            meta: {
                total,
                page: Number(page),
                limit: take
            }
        })
    } catch (error) {
        console.error("Error listing projects:", error);
        return res.status(500).json({ error: "Failed to list all projects" });
    }
}

export const getProject = async(req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                developer: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        socialLinks: true
                    }
                },
                comments: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        if(!project) return res.status(404).json({
            error: "Project not found"
        })
        return res.json(project);
    } catch (err) {
        console.error("getProject error:", err);
        return res.status(500).json({ error: "Failed to get project" });
    }
}

export const createProject = async(req, res) => {
    try {
        const clerkId = getClerkUserId(req);
        if(!clerkId) return res.status(401).json({ error: "Unauthorized"});

        const developer = await prisma.developer.findUnique({ where: { clerkId }});
        if(!developer) return res.status(403).json({ error: "Only developers can create projects"})

        const { title, description, useCase, howToUse, techStack = [], category, demoLink, repoLink, images = [] } = req.body;

        if(!title || !description) return res.status(400).json({
            error: "Title and description are required"
        })

        const project = await prisma.project.create({
            data: {
                developerId: developer.id,
                title,
                description,
                useCase,
                howToUse,
                techStack,
                category,
                demoLink,
                repoLink,
                images
            }
        })

        return res.status(201).json(project);
    } catch (err) {
        console.error("createProject error:", err);
        return res.status(500).json({ error: "Failed to create project" });
    }
}

export const updateProject = async(req, res) => {
    try {
        const { id } = req.params;
        const clerkId = getClerkUserId(req);
        if(!clerkId) return res.status(401).json({ error: "Unauthorized"});

        const developer = await prisma.developer.findUnique({ where: { clerkId}})
        if(!developer) return res.status(403).json({ error: "Only developers can update projects"})

        const project = await prisma.project.findUnique({ where: { id }})
        if(!project) return res.status(404).json({ error: "Project not found"})
        if(project.developerId !== developer.id) return res.status(403).json({ error: "You are not authorized to update this project"})

        const updates = {};
        const allowed = ["title", "description", "useCase", "howToUse", "techStack", "category", "demoLink", "repoLink", "images"];
        
        for(const key of allowed) {
            if(req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const updated = await prisma.project.update({
            where: { id },
            data: updates
        })

        return res.json(updated);
    } catch (err) {
        console.error("updatedProject:", err)
        return res.status(500).json({ error: "Failed to update project" });
    }
}

export const deleteProject = async(req, res) => {
    try {
        const { id } = req.params;
        const clerkId = getClerkUserId(req);
        if(!clerkId) return res.status(401).json({ error: "Unauthorized" });

        const developer = await prisma.developer.findUnique({ where: { clerkId}});
        if(!developer) return res.status(403).json({ error: "Only developers can delete projects"})

        const project = await prisma.project.findUnique({ where: { id }});
        if(!project) return res.status(404).json({ error: "Project not found" });
        if(project.developerId !== developer.id) return res.status(403).json({ error: "You are not authorized to delete this project"})

        await prisma.project.delete({ where: { id }});
        return res.status(204).json({});
    } catch (error) {
        console.error("deleteProject error:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }
}