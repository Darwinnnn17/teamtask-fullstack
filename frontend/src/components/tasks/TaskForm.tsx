"use client";

import { FormEvent, useState } from "react";
import { Project } from "@/types/project";
import { TaskInput, TaskPriority } from "@/types/task";

type TaskFormProps = {
  projects: Project[];
  onSubmit: (data: TaskInput) => Promise<void>;
  isSubmitting?: boolean;
};

export default function TaskForm({
  projects,
  onSubmit,
  isSubmitting = false,
}: TaskFormProps) {
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [deadline, setDeadline] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!projectId) {
      setFormError("Project wajib dipilih.");
      return;
    }

    if (title.trim().length < 3) {
      setFormError("Judul task minimal 3 karakter.");
      return;
    }

    try {
      await onSubmit({
        projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDeadline("");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal membuat task."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Buat Task Baru</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan task dan hubungkan dengan project.
        </p>
      </div>

      {formError && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
          >
            <option value="">Pilih project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Judul Task
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
            placeholder="Contoh: Build project frontend"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24 w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
            placeholder="Jelaskan detail task..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || projects.length === 0}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Buat Task"}
        </button>

        {projects.length === 0 && (
          <p className="text-sm text-gray-500">
            Buat project terlebih dahulu sebelum membuat task.
          </p>
        )}
      </div>
    </form>
  );
}