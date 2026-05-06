"use client";

import AppLayout from "@/components/layout/AppLayout";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { TaskInput, TaskStatus } from "@/types/task";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    isSubmitting,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const { projects } = useProjects();

  const handleCreateTask = async (data: TaskInput) => {
    await createTask(data);
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    await updateTaskStatus(id, status);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="text-gray-600">Memuat tasks...</p>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <TaskForm
          projects={projects}
          onSubmit={handleCreateTask}
          isSubmitting={isSubmitting}
        />

        <div>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <p className="mt-2 text-gray-600">
              Kelola task, status, deadline, dan prioritas pekerjaan.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Belum ada task
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Buat task pertama kamu dari form di sebelah kiri.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}