export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskUser = {
  id: string;
  name: string;
  email: string;
};

export type TaskProject = {
  id: string;
  name: string;
  description?: string | null;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string | null;
  createdById: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: TaskProject;
  createdBy?: TaskUser;
  assignedTo?: TaskUser | null;
  _count?: {
    comments: number;
    activities: number;
  };
};

export type TasksResponse = {
  message: string;
  data: {
    tasks: Task[];
  };
};

export type TaskResponse = {
  message: string;
  data: {
    task: Task;
  };
};

export type TaskInput = {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: string;
};