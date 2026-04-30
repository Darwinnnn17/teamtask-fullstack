import { Router } from "express";
import {
  createTaskComment,
  getTaskComments,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/tasks/:id/comments", getTaskComments);
router.post("/tasks/:id/comments", createTaskComment);

export default router;