"use client";

import Link from "next/link";
import { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  onDelete: (id: string) => Promise<void>;
};

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const taskCount = project._count?.tasks ?? project.tasks?.length ?? 0;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus project "${project.name}"?`
    );

    if (!confirmed) return;

    await onDelete(project.id);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {project.description || "Tidak ada deskripsi."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
              {taskCount} task
            </span>

            {project.createdBy && (
              <span className="rounded-full bg-gray-50 px-3 py-1 ring-1 ring-gray-200">
                Dibuat oleh {project.createdBy.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}`}
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