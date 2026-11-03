import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { usePublishedCourse } from "../../hooks/usePublishedCourse";
import CourseDetailsContent from "../../components/course/CourseDetailsContent";

import { enrollmentService } from "../../services/enrollment.service";
import { useAuthStore } from "../../store/authStore";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { course, isLoading, errorMessage } = usePublishedCourse(courseId);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  // Check whether the current user is already enrolled.
  useEffect(() => {
    let isMounted = true;

    const checkEnrollment = async () => {
      if (!isAuthenticated || !courseId) {
        setIsEnrolled(false);
        setCheckingEnrollment(false);
        return;
      }

      try {
        setCheckingEnrollment(true);

        const enrolledCourses = await enrollmentService.getMyCourses();

        if (!isMounted) return;

        const alreadyEnrolled = enrolledCourses.some(
          (item) => item.course.courseId === courseId,
        );

        setIsEnrolled(alreadyEnrolled);
      } catch (error) {
        if (isMounted) {
          setEnrollmentError(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setCheckingEnrollment(false);
        }
      }
    };

    void checkEnrollment();

    return () => {
      isMounted = false;
    };
  }, [courseId, isAuthenticated]);

  // Handle enrollment.
  const handleEnroll = async () => {
    if (!courseId || !course) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Paid enrollment requires payment integration.
    if (course.finalPrice > 0) {
      setEnrollmentError(
        "Online payment for paid courses is not available yet.",
      );
      return;
    }

    if (isEnrolled || enrolling) return;

    try {
      setEnrolling(true);
      setEnrollmentError(null);

      await enrollmentService.enroll(courseId);

      setIsEnrolled(true);

      navigate(`/student/courses/${courseId}/learn`);
    } catch (error) {
      setEnrollmentError(getApiErrorMessage(error));
    } finally {
      setEnrolling(false);
    }
  };

  const handleGoToLearning = () => {
    if (courseId) {
      navigate(`/student/courses/${courseId}/learn`);
    }
  };

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

      {enrollmentError && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {enrollmentError}
          </div>
        </div>
      )}

      <CourseDetailsContent
        course={course}
        onEnroll={handleEnroll}
        onGoToLearning={handleGoToLearning}
        isEnrolled={isEnrolled}
        enrolling={enrolling}
        checkingEnrollment={checkingEnrollment}
      />
    </main>
  );
}
