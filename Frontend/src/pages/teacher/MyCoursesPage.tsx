import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";

import MyCoursesHeader from "../../components/teacher/courses/MyCoursesHeader";
import CourseStats from "../../components/teacher/courses/CourseStats";
import CourseGrid from "../../components/teacher/courses/CourseGrid";
import MyCoursesEmptyState from "../../components/teacher/courses/MyCoursesEmptyState";

import { Button } from "../../components/common/ui/Button";

import { courseService } from "../../services/course.service";
import { getApiErrorMessage } from "../../utils/apiError";
import { useToastStore } from "../../store/toastStore";

import type { Course } from "../../types/course";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCourses = async () => {
      try {
        const result = await courseService.getMyCourses();

        if (!cancelled) {
          setCourses(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = getApiErrorMessage(err);

          setError(message);
          addToast(message, "error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchCourses();

    return () => {
      cancelled = true;
    };
  }, [addToast, refreshKey]);

  const handleCreateCourse = () => {
    navigate("/teacher/courses/create");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <TeacherSidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <MyCoursesHeader onCreateCourse={handleCreateCourse} />

          {loading ? (
            <div
              className="flex min-h-64 items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
                <p className="mt-4 text-sm text-slate-400">
                  Loading your courses...
                </p>
              </div>
            </div>
          ) : error ? (
            <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <h2 className="text-lg font-semibold text-red-400">
                Unable to load courses
              </h2>

              <p className="mt-2 text-sm text-slate-400">{error}</p>

              <div className="mt-5 flex justify-center">
                <Button onClick={handleRetry}>Try Again</Button>
              </div>
            </section>
          ) : courses.length === 0 ? (
            <MyCoursesEmptyState onCreateCourse={handleCreateCourse} />
          ) : (
            <>
              <CourseStats courses={courses} />

              <section className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold">All Courses</h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage your existing courses and continue building your
                    content.
                  </p>
                </div>

                <CourseGrid courses={courses} />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
