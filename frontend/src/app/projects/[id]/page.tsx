type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Project Detail</h1>
          <p className="mt-2 text-gray-600">
            Halaman detail project akan dikembangkan di step berikutnya.
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
            <span className="font-medium">Project ID:</span> {id}
          </div>
        </div>
      </div>
    </main>
  );
}