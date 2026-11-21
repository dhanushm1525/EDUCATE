import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";

import TeacherLayout from "../../components/teacher/layout/TeacherLayout";
import EnrolledCourseCard from "../../components/student/EnrolledCourseCard";

import { enrollmentService } from "../../services/enrollment.service";
import { courseProgressService } from "../../services/courseProgress.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { EnrolledCourse } from "../../types/enrollment";
import type { CourseProgress } from "../../types/courseProgress";

export default function TeacherMyLearningPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [progressList, setProgressList] = useState<CourseProgress[]>([]);

  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const enrolledCourses = await enrollmentService.getMyCourses();

        if (!isMounted) return;

        setCourses(enrolledCourses);
        setErrorMessage(null);

        try {
          const progress = await courseProgressService.getMyProgress();

          if (!isMounted) return;

          setProgressList(progress);
          setProgressError(null);
        } catch (error) {
          if (!isMounted) return;

          setProgressError(getApiErrorMessage(error));
          setProgressList([]);
        }
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(getApiErrorMessage(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setErrorMessage(null);
    setProgressError(null);
    setLoading(true);
    setRetryCount((previous) => previous + 1);
  };

  return (
    <TeacherLayout>
      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">My Learning</h1>
            <p className="mt-1 text-sm text-slate-400">
              Continue learning from the courses you have enrolled in.
            </p>
          </div>
        </header>

        {!loading && !errorMessage && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Enrolled courses</p>
            <p className="mt-2 text-3xl font-bold">{courses.length}</p>
          </div>
        )}

        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-400">Loading your courses...</p>
            </div>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-center">
            <p className="text-sm text-red-300">{errorMessage}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {!loading && !errorMessage && progressError && (
          <div className="rounded-lg border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-300">
            Your courses loaded, but course progress could not be retrieved.
          </div>
        )}

        {!loading && !errorMessage && courses.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <BookOpen size={36} className="mx-auto text-slate-500" />

            <h2 className="mt-5 text-lg font-bold">No enrolled courses</h2>

            <p className="mt-2 text-sm text-slate-400">
              Explore available courses and start learning.
            </p>

            <Link
              to="/teacher/explore-courses"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Explore Courses
            </Link>
          </div>
        )}

        {!loading && !errorMessage && courses.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((enrollment) => {
              const progress = progressList.find(
                (item) => item.courseId === enrollment.course.courseId,
              );

              return (
                <EnrolledCourseCard
                  key={enrollment.enrollmentId}
                  enrollment={enrollment}
                  progress={progress}
                  learningBasePath="/teacher/learn"
                />
              );
            })}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
