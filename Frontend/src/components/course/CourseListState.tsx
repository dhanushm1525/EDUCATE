interface CourseListStateProps {
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
}

export default function CourseListState({
  isLoading,
  errorMessage,
  isEmpty,
}: CourseListStateProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-label="Loading courses"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="h-40 animate-pulse bg-slate-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-8 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        role="alert"
      >
        {errorMessage}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          No courses available
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Published courses will appear here when they become available.
        </p>
      </div>
    );
  }

  return null;
}
