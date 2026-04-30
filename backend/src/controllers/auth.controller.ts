import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validations/auth.validation";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
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

    const token = generateToken({
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
  } catch (error: any) {
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

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
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
  } catch (error: any) {
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

export const me = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
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
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};