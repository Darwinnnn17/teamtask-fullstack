import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().uuid("Invalid project id"),
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  deadline: z.string().datetime().optional(),
  assignedToId: z.string().uuid("Invalid assigned user id").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters").optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  deadline: z.string().datetime().optional().nullable(),
  assignedToId: z.string().uuid("Invalid assigned user id").optional().nullable(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export const assignTaskSchema = z.object({
  assignedToId: z.string().uuid("Invalid assigned user id"),
});