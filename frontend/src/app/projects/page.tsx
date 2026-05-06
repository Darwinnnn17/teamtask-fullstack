"use client";

import AppLayout from "@/components/layout/AppLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { ProjectInput } from "@/types/project";

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    isSubmitting,
    error,
    createProject,
    deleteProject,
  } = useProjects();

  const handleCreateProject = async (data: ProjectInput) => {
    await createProject(data);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <p className="text-gray-600">Memuat projects...</p>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
    </AppLayout>
  );
}