import { Request, Response } from "express";
import prisma from "../config/prisma";
import {
  assignTaskSchema,
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validations/task.validation";

const getParamId = (req: Request) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return null;
  }

  return id;
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const validatedData = createTaskSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: {
        id: validatedData.projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (validatedData.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: validatedData.assignedToId,
        },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId: validatedData.projectId,
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority || "MEDIUM",
        deadline: validatedData.deadline
          ? new Date(validatedData.deadline)
          : undefined,
        assignedToId: validatedData.assignedToId,
        createdById: userId,
        activities: {
          create: {
            userId,
            action: "TASK_CREATED",
            description: "Task was created",
          },
        },
      },
      include: {
        project: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: true,
      },
    });

    return res.status(201).json({
      message: "Task created successfully",
      data: {
        task,
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

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            activities: true,
          },
        },
      },
    });

    return res.json({
      message: "Tasks retrieved successfully",
      data: {
        tasks,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
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

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.json({
      message: "Task retrieved successfully",
      data: {
        task,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const userId = req.user?.userId;

    if (!id) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const validatedData = updateTaskSchema.parse(req.body);

    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (validatedData.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: validatedData.assignedToId,
        },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        deadline:
          validatedData.deadline === null
            ? null
            : validatedData.deadline
              ? new Date(validatedData.deadline)
              : undefined,
        assignedToId: validatedData.assignedToId,
        activities: {
          create: {
            userId,
            action: "TASK_UPDATED",
            description: "Task was updated",
          },
        },
      },
      include: {
        project: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: true,
      },
    });

    return res.json({
      message: "Task updated successfully",
      data: {
        task,
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

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const userId = req.user?.userId;

    if (!id) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const validatedData = updateTaskStatusSchema.parse(req.body);

    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status: validatedData.status,
        activities: {
          create: {
            userId,
            action: "TASK_STATUS_UPDATED",
            description: `Task status changed to ${validatedData.status}`,
          },
        },
      },
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: true,
      },
    });

    return res.json({
      message: "Task status updated successfully",
      data: {
        task,
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

export const assignTask = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const userId = req.user?.userId;

    if (!id) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const validatedData = assignTaskSchema.parse(req.body);

    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const assignedUser = await prisma.user.findUnique({
      where: {
        id: validatedData.assignedToId,
      },
    });

    if (!assignedUser) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        assignedToId: validatedData.assignedToId,
        activities: {
          create: {
            userId,
            action: "TASK_ASSIGNED",
            description: `Task assigned to ${assignedUser.name}`,
          },
        },
      },
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activities: true,
      },
    });

    return res.json({
      message: "Task assigned successfully",
      data: {
        task,
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

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);

    if (!id) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Task deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};