import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const now = new Date();

    const [
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      overdueTasks,
      highPriorityTasks,
      recentTasks,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.task.count(),
      prisma.task.count({
        where: {
          status: "TODO",
        },
      }),
      prisma.task.count({
        where: {
          status: "IN_PROGRESS",
        },
      }),
      prisma.task.count({
        where: {
          status: "DONE",
        },
      }),
      prisma.task.count({
        where: {
          deadline: {
            lt: now,
          },
          status: {
            not: "DONE",
          },
        },
      }),
      prisma.task.count({
        where: {
          priority: "HIGH",
        },
      }),
      prisma.task.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
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
      }),
    ]);

    return res.json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        stats: {
          totalProjects,
          totalTasks,
          todoTasks,
          inProgressTasks,
          doneTasks,
          overdueTasks,
          highPriorityTasks,
        },
        recentTasks,
      },
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};