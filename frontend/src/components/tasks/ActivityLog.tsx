import { TaskActivity } from "@/types/task";

type ActivityLogProps = {
  activities: TaskActivity[];
};

const formatAction = (action: string) => {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ActivityLog({ activities }: ActivityLogProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
        <p className="mt-3 text-sm text-gray-500">
          Belum ada aktivitas untuk task ini.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>

      <div className="mt-5 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-2 border-gray-200 pl-4">
            <p className="text-sm font-medium text-gray-900">
              {formatAction(activity.action)}
            </p>

            {activity.description && (
              <p className="mt-1 text-sm text-gray-600">
                {activity.description}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-400">
              {activity.user?.name || "Unknown User"} •{" "}
              {new Date(activity.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}