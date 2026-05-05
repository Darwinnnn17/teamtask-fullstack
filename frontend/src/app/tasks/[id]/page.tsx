"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Task, TaskResponse } from "@/types/task";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("teamtask_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<TaskResponse>(`/tasks/${params.id}`);
        setTask(response.data.data.task);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message || "Gagal mengambil detail task."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Memuat detail task...</p>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            Task tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {error || "Task tidak tersedia."}
          </p>
          <button
            onClick={() => router.push("/tasks")}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Kembali ke Tasks
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeamTask</h1>
            <p className="text-sm text-gray-500">Task Detail</p>
          </div>

          <button
            onClick={() => router.push("/tasks")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Tasks
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <p className="mt-2 text-gray-600">
            {task.description || "Tidak ada deskripsi."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Project</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.project?.name || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.status}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Priority</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.priority}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.deadline
                  ? new Date(task.deadline).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.createdBy?.name || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Assigned To</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.assignedTo?.name || "-"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}