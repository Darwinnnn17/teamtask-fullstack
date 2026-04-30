import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">TeamTask</h1>
        <p className="mt-3 text-gray-600">
          Fullstack task management application.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg border px-4 py-2 text-gray-900"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}