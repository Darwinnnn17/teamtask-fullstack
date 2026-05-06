"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import AppLayout from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { Project, ProjectResponse } from "@/types/project";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<ProjectResponse>(`/projects/${params.id}`);

        setProject(response.data.data.project);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message || "Gagal mengambil detail project."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="text-gray-600">Memuat detail project...</p>
        </section>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">
              Project tidak ditemukan
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {error || "Project tidak tersedia."}
            </p>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          <p className="mt-2 text-gray-600">
            {project.description || "Tidak ada deskripsi."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Project ID</p>
              <p className="mt-1 break-all text-sm font-medium text-gray-900">
                {project.id}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Total Task</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {project.tasks?.length ?? project._count?.tasks ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {project.createdBy?.name || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>

          {!project.tasks || project.tasks.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              Belum ada task dalam project ini.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {project.tasks.map((task) => (
                <div key={task.id} className="rounded-xl border bg-gray-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {task.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description || "Tidak ada deskripsi."}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                        {task.status}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}