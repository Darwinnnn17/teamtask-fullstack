import { TaskComment } from "@/types/task";

type CommentListProps = {
  comments: TaskComment[];
};

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Komentar</h3>
        <p className="mt-3 text-sm text-gray-500">
          Belum ada komentar untuk task ini.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Komentar</h3>

      <div className="mt-5 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {comment.user?.name || "Unknown User"}
                </p>
                <p className="mt-1 text-sm text-gray-600">{comment.comment}</p>
              </div>

              <p className="whitespace-nowrap text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}