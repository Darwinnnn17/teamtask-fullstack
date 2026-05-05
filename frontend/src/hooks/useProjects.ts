"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import {
  Project,
  ProjectInput,
  ProjectResponse,
  ProjectsResponse,
} from "@/types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get<ProjectsResponse>("/projects");

      setProjects(response.data.data.projects);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || "Gagal mengambil data project."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: ProjectInput) => {
    try {
      setIsSubmitting(true);
      setError("");

      const response = await api.post<ProjectResponse>("/projects", data);

      setProjects((prev) => [response.data.data.project, ...prev]);

      return response.data.data.project;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal membuat project.";

      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setError("");

      await api.delete(`/projects/${id}`);

      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || "Gagal menghapus project.";

      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    isSubmitting,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}