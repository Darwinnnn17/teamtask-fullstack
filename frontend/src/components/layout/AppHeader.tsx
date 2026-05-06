"use client";

import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

type AppHeaderProps = {
  user: User | null;
  onLogout: () => void;
};

export default function AppHeader({ user, onLogout }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => router.push("/dashboard")} className="text-left">
          <h1 className="text-xl font-bold text-gray-900">TeamTask</h1>
          <p className="text-sm text-gray-500">
            Fullstack Task Management App
          </p>
        </button>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/projects")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Projects
          </button>

          <button
            onClick={() => router.push("/tasks")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Tasks
          </button>

          <button
            onClick={onLogout}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}