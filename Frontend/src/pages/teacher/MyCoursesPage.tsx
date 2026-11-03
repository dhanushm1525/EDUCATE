import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";

import MyCoursesHeader from "../../components/teacher/courses/MyCoursesHeader";
import CourseStats from "../../components/teacher/courses/CourseStats";
import CourseGrid from "../../components/teacher/courses/CourseGrid";
import MyCoursesEmptyState from "../../components/teacher/courses/MyCoursesEmptyState";

import { LoadingState } from "../../components/common/ui/LoadingState";
import { ErrorState } from "../../components/common/ui/ErrorState";

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
        setLoading(true);

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
    <TeacherLayout>
      <div className="space-y-8">
        <MyCoursesHeader onCreateCourse={handleCreateCourse} />

        {loading ? (
          <LoadingState message="Loading your courses..." />
        ) : error ? (
          <ErrorState message={error} onRetry={handleRetry} />
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
    </TeacherLayout>
  );
}
