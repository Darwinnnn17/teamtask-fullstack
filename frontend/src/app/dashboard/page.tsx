"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import RecentTasks from "@/components/dashboard/RecentTasks";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { stats, recentTasks, isLoading, error } = useDashboard();

  useEffect(() => {
    const token = localStorage.getItem("teamtask_token");
    const storedUser = localStorage.getItem("teamtask_user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("teamtask_token");
    localStorage.removeItem("teamtask_user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Memuat dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            Gagal memuat dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={handleLogout}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            Kembali ke Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeamTask</h1>
            <p className="text-sm text-gray-500">
              Fullstack Task Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Ringkasan project dan task terbaru.
          </p>
        </div>

        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              description="Semua project yang dibuat"
            />
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              description="Semua task dalam sistem"
            />
            <StatCard
              title="Todo"
              value={stats.todoTasks}
              description="Task yang belum dikerjakan"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTasks}
              description="Task yang sedang berjalan"
            />
            <StatCard
              title="Done"
              value={stats.doneTasks}
              description="Task yang sudah selesai"
            />
            <StatCard
              title="Overdue"
              value={stats.overdueTasks}
              description="Task melewati deadline"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriorityTasks}
              description="Task prioritas tinggi"
            />
          </div>
        )}

        <div className="mt-8">
          <RecentTasks tasks={recentTasks} />
        </div>
      </section>
    </main>
  );
}