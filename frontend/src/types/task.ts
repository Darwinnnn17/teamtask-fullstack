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

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: TaskUser;
};

export type TaskActivity = {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  description?: string | null;
  createdAt: string;
  user?: TaskUser;
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
  comments?: TaskComment[];
  activities?: TaskActivity[];
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

export type TaskCommentsResponse = {
  message: string;
  data: {
    comments: TaskComment[];
  };
};

export type TaskCommentResponse = {
  message: string;
  data: {
    comment: TaskComment;
  };
};

export type TaskInput = {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: string;
};