"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import {
  Task,
  TaskComment,
  TaskCommentResponse,
  TaskCommentsResponse,
  TaskResponse,
} from "@/types/task";

export function useTaskDetail(taskId: string | undefined) {
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState("");

  const fetchTaskDetail = async () => {
    if (!taskId) return;

    try {
      setIsLoading(true);
      setError("");

      const [taskResponse, commentsResponse] = await Promise.all([
        api.get<TaskResponse>(`/tasks/${taskId}`),
        api.get<TaskCommentsResponse>(`/tasks/${taskId}/comments`),
      ]);

      setTask(taskResponse.data.data.task);
      setComments(commentsResponse.data.data.comments);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Gagal mengambil detail task."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (comment: string) => {
    if (!taskId) return;

    try {
      setIsSubmittingComment(true);
      setError("");

      const response = await api.post<TaskCommentResponse>(
        `/tasks/${taskId}/comments`,
        {
          comment,
        }
      );

      setComments((prev) => [...prev, response.data.data.comment]);

      await fetchTaskDetail();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal menambahkan komentar.";

      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return {
    task,
    comments,
    isLoading,
    isSubmittingComment,
    error,
    fetchTaskDetail,
    createComment,
  };
}