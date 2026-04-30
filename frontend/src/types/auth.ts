export type UserRole = "ADMIN" | "MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

export type AuthResponse = {
  message: string;
  data: {
    user: User;
    token: string;
  };
};

export type MeResponse = {
  message: string;
  data: {
    user: User;
  };
};