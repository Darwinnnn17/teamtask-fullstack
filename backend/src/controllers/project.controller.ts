  import { Request, Response } from "express";
  import prisma from "../config/prisma";
  import {
    createProjectSchema,
    updateProjectSchema,
  } from "../validations/project.validation";

  export const createProject = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const validatedData = createProjectSchema.parse(req.body);

      const project = await prisma.project.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return res.status(201).json({
        message: "Project created successfully",
        data: {
          project,
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

  export const getProjects = async (req: Request, res: Response) => {
    try {
      const projects = await prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return res.json({
        message: "Projects retrieved successfully",
        data: {
          projects,
        },
      });
    } catch {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  export const getProjectById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project id",
    });
  }

      const project = await prisma.project.findUnique({
        where: {
          id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          tasks: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      return res.json({
        message: "Project retrieved successfully",
        data: {
          project,
        },
      });
    } catch {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  export const updateProject = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project id",
    });
  }
      const validatedData = updateProjectSchema.parse(req.body);

      const existingProject = await prisma.project.findUnique({
        where: {
          id,
        },
      });

      if (!existingProject) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const project = await prisma.project.update({
        where: {
          id,
        },
        data: validatedData,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

      return res.json({
        message: "Project updated successfully",
        data: {
          project,
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

  export const deleteProject = async (req: Request, res: Response) => {
    try {
    const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      message: "Invalid project id",
    });
  }

      const existingProject = await prisma.project.findUnique({
        where: {
          id,
        },
      });

      if (!existingProject) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      await prisma.project.delete({
        where: {
          id,
        },
      });

      return res.json({
        message: "Project deleted successfully",
      });
    } catch {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };