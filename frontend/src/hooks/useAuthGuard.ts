"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

export function useAuthGuard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("teamtask_token");
    const storedUser = localStorage.getItem("teamtask_user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("teamtask_token");
        localStorage.removeItem("teamtask_user");
        router.push("/login");
        return;
      }
    }

    setIsCheckingAuth(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("teamtask_token");
    localStorage.removeItem("teamtask_user");
    router.push("/login");
  };

  return {
    user,
    isCheckingAuth,
    logout,
  };
}