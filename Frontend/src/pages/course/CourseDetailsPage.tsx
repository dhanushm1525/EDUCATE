import { Link, useParams } from "react-router-dom";

import { usePublishedCourse } from "../../hooks/usePublishedCourse";
import CourseDetailsContent from "../../components/course/CourseDetailsContent";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { course, isLoading, errorMessage } = usePublishedCourse(courseId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-7xl animate-pulse space-y-6"
        >
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="h-96 rounded-2xl bg-slate-200" />
            <div className="h-80 rounded-2xl bg-slate-200" />
          </div>
          <span className="sr-only">Loading course details...</span>
        </div>
      </main>
    );
  }

  if (errorMessage || !course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <section
          role="alert"
          className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center"
        >
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load course
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {errorMessage ?? "This course could not be found."}
          </p>

          <Link
            to="/courses"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse courses
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to courses
        </Link>
      </div>

      <CourseDetailsContent course={course} />
    </main>
  );
}
