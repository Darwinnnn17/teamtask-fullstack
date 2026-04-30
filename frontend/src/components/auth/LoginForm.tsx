"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { AuthResponse } from "@/types/auth";
import { LoginInput, loginSchema } from "@/validations/auth.validation";

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setServerError("");

      const response = await api.post<AuthResponse>("/auth/login", data);

      localStorage.setItem("teamtask_token", response.data.data.token);
      localStorage.setItem(
        "teamtask_user",
        JSON.stringify(response.data.data.user)
      );

      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setServerError(
        axiosError.response?.data?.message || "Login gagal. Coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Masuk ke TeamTask</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gunakan akun kamu untuk mengakses dashboard.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
            placeholder="admin@teamtask.dev"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-gray-900"
            placeholder="password123"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Memproses..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <a href="/register" className="font-medium text-gray-900 underline">
          Register
        </a>
      </p>
    </div>
  );
}