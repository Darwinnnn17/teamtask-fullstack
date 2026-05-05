"use client";

import { FormEvent, useState } from "react";
import { ProjectInput } from "@/types/project";

type ProjectFormProps = {
  onSubmit: (data: ProjectInput) => Promise<void>;
  isSubmitting?: boolean;
};

export default function ProjectForm({
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (name.trim().length < 3) {
      setFormError("Nama project minimal 3 karakter.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setName("");
      setDescription("");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal membuat project."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Buat Project Baru
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tambahkan project untuk mengelompokkan task tim kamu.
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
            Nama Project
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
            placeholder="Contoh: TeamTask Development"
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
            placeholder="Jelaskan tujuan project ini..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Buat Project"}
        </button>
      </div>
    </form>
  );
}