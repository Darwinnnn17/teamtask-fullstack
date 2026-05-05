export type ProjectCreator = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

export type ProjectTask = {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: ProjectCreator;
  tasks?: ProjectTask[];
  _count?: {
    tasks: number;
  };
};

export type ProjectsResponse = {
  message: string;
  data: {
    projects: Project[];
  };
};

export type ProjectResponse = {
  message: string;
  data: {
    project: Project;
  };
};

export type ProjectInput = {
  name: string;
  description?: string;
};