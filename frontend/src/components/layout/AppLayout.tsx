"use client";

import { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import { useAuthGuard } from "@/hooks/useAuthGuard";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isCheckingAuth, logout } = useAuthGuard();

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Memeriksa autentikasi...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AppHeader user={user} onLogout={logout} />
      {children}
    </main>
  );
}