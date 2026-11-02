import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";

import { StudentNavbar } from "../../components/student/StudentNavbar";
import EnrolledCourseCard from "../../components/student/EnrolledCourseCard";

import { enrollmentService } from "../../services/enrollment.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { EnrolledCourse } from "../../types/enrollment";

export default function MyLearningPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial fetch: loading is already true.
  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const result = await enrollmentService.getMyCourses();

        if (isMounted) {
          setCourses(result);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  // Retry fetch: explicitly show loading.
  const handleRetry = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await enrollmentService.getMyCourses();
      setCourses(result);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
              <p className="mt-1 text-sm text-slate-500">
                Continue your learning journey.
              </p>
            </div>
          </div>
        </div>

        {!loading && !errorMessage && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Enrolled courses</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {courses.length}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Loading your courses...
              </p>
            </div>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{errorMessage}</p>

            <button
              type="button"
              onClick={() => void handleRetry()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {!loading && !errorMessage && courses.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen size={30} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No courses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't enrolled in any courses yet. Explore our courses and
              start learning today.
            </p>

            <a
              href="/courses"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Explore Courses
            </a>
          </div>
        )}

        {!loading && !errorMessage && courses.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((enrollment) => (
              <EnrolledCourseCard
                key={enrollment.enrollmentId}
                enrollment={enrollment}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
