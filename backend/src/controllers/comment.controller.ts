import { Request, Response } from "express";
import prisma from "../config/prisma";
import { createCommentSchema } from "../validations/comment.validation";

const getTaskId = (req: Request) => {
  const taskId = req.params.id;

  if (!taskId || typeof taskId !== "string") {
    return null;
  }

  return taskId;
};

export const getTaskComments = async (req: Request, res: Response) => {
  try {
    const taskId = getTaskId(req);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const comments = await prisma.taskComment.findMany({
      where: {
        taskId,
      },
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
    });

    return res.json({
      message: "Task comments retrieved successfully",
      data: {
        comments,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createTaskComment = async (req: Request, res: Response) => {
  try {
    const taskId = getTaskId(req);
    const userId = req.user?.userId;

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const validatedData = createCommentSchema.parse(req.body);

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        userId,
        comment: validatedData.comment,
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
    });

    await prisma.taskActivity.create({
      data: {
        taskId,
        userId,
        action: "COMMENT_ADDED",
        description: "A comment was added to the task",
      },
    });

    return res.status(201).json({
      message: "Comment created successfully",
      data: {
        comment,
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