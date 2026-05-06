"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import RecentTasks from "@/components/dashboard/RecentTasks";

export default function DashboardPage() {
  const { stats, recentTasks, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="text-gray-600">Memuat dashboard...</p>
        </section>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">
              Gagal memuat dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
    </AppLayout>
  );
}