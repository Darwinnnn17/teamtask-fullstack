"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("teamtask_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard TeamTask
          </h1>
          <p className="mt-2 text-gray-600">
            Login berhasil. Dashboard utama akan kita bangun di step berikutnya.
          </p>

          {user && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm">
              <p>
                <span className="font-medium">Nama:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}