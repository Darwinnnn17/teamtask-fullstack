"use client";

import { FormEvent, useState } from "react";

type CommentFormProps = {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting?: boolean;
};

export default function CommentForm({
  onSubmit,
  isSubmitting = false,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!comment.trim()) {
      setFormError("Komentar tidak boleh kosong.");
      return;
    }

    try {
      await onSubmit(comment.trim());
      setComment("");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menambahkan komentar."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        Tambah Komentar
      </h3>

      {formError && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <div className="mt-4">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="min-h-24 w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
          placeholder="Tulis komentar untuk task ini..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
      </button>
    </form>
  );
}