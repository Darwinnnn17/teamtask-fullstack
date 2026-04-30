"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const auth_validation_1 = require("../validations/auth.validation");
const register = async (req, res) => {
    try {
        const validatedData = auth_validation_1.registerSchema.parse(req.body);
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
        });
        return res.status(201).json({
            message: "User registered successfully",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = auth_validation_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            role: user.role,
        });
        return res.json({
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    }
    catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.json({
            message: "Current user retrieved successfully",
            data: {
                user,
            },
        });
    }
    catch {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.me = me;
