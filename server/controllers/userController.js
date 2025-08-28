import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role = 'user', skills, bio, socialLinks } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        // Check if email exists in either User or Developer
        const existingUser = await prisma.user.findUnique({ where: { email } });
        const existingDeveloper = await prisma.developer.findUnique({ where: { email } });
        
        if (existingUser || existingDeveloper) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newAccount;
        let accountType;

        if (role === 'developer') {
            // Create Developer account
            newAccount = await prisma.developer.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                    skills: skills || [],
                    bio: bio || '',
                    socialLinks: socialLinks || {}
                }
            });
            accountType = 'developer';
        } else {
            // Create regular User account
            newAccount = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword
                }
            });
            accountType = 'user';
        }

        const token = jwt.sign(
            { 
                userId: newAccount.id, 
                email: newAccount.email,
                accountType,
                role: newAccount.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Account registered successfully",
            user: {
                id: newAccount.id,
                name: newAccount.name,
                email: newAccount.email,
                role: newAccount.role,
                accountType
            },
            token
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({
            error: "Failed to register user",
            details: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        console.log(`Login attempt for email: ${email}`);
        let user = await prisma.user.findUnique({ where: { email } });
        let accountType = 'user';
        
        if (!user) {
            console.log('User not found in User table, checking Developer table...');
            user = await prisma.developer.findUnique({ where: { email } });
            accountType = 'developer';
        }

        if (!user) {
            console.log('User not found in either table');
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log(`User found in ${accountType} table`);
        console.log(`Stored hash: ${user.passwordHash?.substring(0, 10)}...`);
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log(`Password valid: ${isPasswordValid}`);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                accountType,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountType
            },
            token
        });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({
            error: "Login failed",
            details: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        let user;
        if (decoded.accountType === 'developer') {
            user = await prisma.developer.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    bio: true,
                    skills: true,
                    socialLinks: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } else {
            user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            ...user,
            accountType: decoded.accountType
        });
    } catch (error) {
        console.error("getCurrentUser error:", error);
        res.status(401).json({
            error: "Invalid or expired token",
            details: error.message
        });
    }
};