"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import {
  Task,
  TaskInput,
  TaskResponse,
  TasksResponse,
  TaskStatus,
} from "@/types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get<TasksResponse>("/tasks");
      setTasks(response.data.data.tasks);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Gagal mengambil data task."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (data: TaskInput) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await api.post<TaskResponse>("/tasks", data);
      setTasks((prev) => [response.data.data.task, ...prev]);

      return response.data.data.task;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal membuat task.";

      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      setError("");

      const response = await api.patch<TaskResponse>(`/tasks/${id}/status`, {
        status,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? response.data.data.task : task
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal mengubah status task.";

      setError(message);
      throw new Error(message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError("");

      await api.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal menghapus task.";

      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    isSubmitting,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
}