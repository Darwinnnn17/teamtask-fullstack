"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { DashboardResponse, DashboardStats, RecentTask } from "@/types/dashboard";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<DashboardResponse>("/dashboard/stats");

        setStats(response.data.data.stats);
        setRecentTasks(response.data.data.recentTasks);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Gagal mengambil data dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    stats,
    recentTasks,
    isLoading,
    error,
  };
}