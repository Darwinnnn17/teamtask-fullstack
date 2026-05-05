"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTaskDetail } from "@/hooks/useTaskDetail";
import CommentForm from "@/components/tasks/CommentForm";
import CommentList from "@/components/tasks/CommentList";
import ActivityLog from "@/components/tasks/ActivityLog";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const {
    task,
    comments,
    isLoading,
    isSubmittingComment,
    error,
    createComment,
  } = useTaskDetail(params.id);

  useEffect(() => {
    const token = localStorage.getItem("teamtask_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

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

  const activities = task.activities || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeamTask</h1>
            <p className="text-sm text-gray-500">Task Detail</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/tasks")}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back to Tasks
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {task.title}
                </h2>
                <p className="mt-2 text-gray-600">
                  {task.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                  {task.status}
                </span>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Project</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {task.project?.name || "-"}
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

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(task.createdAt).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(task.updatedAt).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <CommentList comments={comments} />
        </div>

        <div className="space-y-6">
          <CommentForm
            onSubmit={createComment}
            isSubmitting={isSubmittingComment}
          />

          <ActivityLog activities={activities} />
        </div>
      </section>
    </main>
  );
}