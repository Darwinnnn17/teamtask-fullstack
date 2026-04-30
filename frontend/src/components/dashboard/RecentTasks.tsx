import { RecentTask } from "@/types/dashboard";

type RecentTasksProps = {
  tasks: RecentTask[];
};

const statusLabel: Record<RecentTask["status"], string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const priorityLabel: Record<RecentTask["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export default function RecentTasks({ tasks }: RecentTasksProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        <p className="mt-3 text-sm text-gray-500">Belum ada task terbaru.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>

      <div className="mt-5 space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border bg-gray-50 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Project: {task.project.name}
                </p>
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                  {statusLabel[task.status]}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                  {priorityLabel[task.priority]}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Dibuat oleh {task.createdBy.name}
              {task.assignedTo ? ` • Assigned to ${task.assignedTo.name}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}