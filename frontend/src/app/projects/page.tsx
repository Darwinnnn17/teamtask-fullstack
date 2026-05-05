"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { ProjectInput } from "@/types/project";

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    isLoading,
    isSubmitting,
    error,
    createProject,
    deleteProject,
  } = useProjects();

  useEffect(() => {
    const token = localStorage.getItem("teamtask_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleCreateProject = async (data: ProjectInput) => {
    await createProject(data);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Memuat projects...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeamTask</h1>
            <p className="text-sm text-gray-500">Project Management</p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <ProjectForm
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
        />

        <div>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <p className="mt-2 text-gray-600">
              Kelola project yang menjadi wadah task tim.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Belum ada project
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Buat project pertama kamu dari form di sebelah kiri.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}