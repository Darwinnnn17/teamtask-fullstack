"use client";

import Link from "next/link";
import { Task, TaskStatus } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const statusLabel: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskCard({
  task,
  onUpdateStatus,
  onDelete,
}: TaskCardProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus task "${task.title}"?`
    );

    if (!confirmed) return;

    await onDelete(task.id);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>

          <p className="mt-2 text-sm text-gray-600">
            {task.description || "Tidak ada deskripsi."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
              {task.project?.name || "No project"}
            </span>

            <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
              {statusLabel[task.status]}
            </span>

            <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
              {task.priority}
            </span>

            {task.deadline && (
              <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
                Deadline: {new Date(task.deadline).toLocaleDateString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={task.status}
            onChange={(event) =>
              onUpdateStatus(task.id, event.target.value as TaskStatus)
            }
            className="rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <Link
            href={`/tasks/${task.id}`}
            className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Detail
          </Link>

          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}