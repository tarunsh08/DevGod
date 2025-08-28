import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    developer: {
                        select: {
                            id: true,
                            name: true,
                            bio: true,
                            socialLinks: true
                        }
                    }
                },
            }),
            prisma.project.count({ where }),
        ]);

        return res.json({
            data: projects,
            meta: {
                total,
                page: Number(page) || 1,
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        console.error("Error listing projects:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }
};

export const getProject = async (req, res) => {
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
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ error: "Failed to fetch project" });
    }
};

export const createProject = async (req, res) => {
    try {
        const { title, description, category, tags, useCase, repoUrl, demoUrl } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                category,
                tags,
                useCase,
                repoUrl,
                demoUrl,
                developerId: userId
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { title, description, category, tags, useCase, repoUrl, demoUrl } = req.body;

        // Check if project exists and belongs to user
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });

        if (!existingProject) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (existingProject.developerId !== userId) {
            return res.status(403).json({ error: "Not authorized to update this project" });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                category,
                tags,
                useCase,
                repoUrl,
                demoUrl
            }
        });

        res.json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Check if project exists and belongs to user
        const existingProject = await prisma.project.findUnique({
            where: { id }
        });

        if (!existingProject) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (existingProject.developerId !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this project" });
        }

        await prisma.project.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
};