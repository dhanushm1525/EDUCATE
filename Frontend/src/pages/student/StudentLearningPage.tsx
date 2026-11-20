import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { StudentNavbar } from "../../components/student/StudentNavbar";
import LearningSidebar from "../../components/student/learning/LearningSidebar";
import LessonContentViewer from "../../components/student/learning/LessonContentViewer";
import AssignmentPanel from "../../components/student/learning/AssignmentPanel";

import { courseService } from "../../services/course.service";
import { lessonService } from "../../services/lesson.service";
import { courseProgressService } from "../../services/courseProgress.service";

import { getApiErrorMessage } from "../../utils/apiError";

import type { Course } from "../../types/course";
import type {
  ChapterPreview,
  LessonPreview,
} from "../../types/courseLearningContent";
import type { StudentLesson } from "../../types/studentLesson";
import type { CourseProgress } from "../../types/courseProgress";

interface LessonPosition {
  chapterId: string;
  lesson: LessonPreview;
}

export default function StudentLearningPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<ChapterPreview[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<StudentLesson | null>(
    null,
  );

  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lastVideoSaveTimeRef = useRef<Map<string, number>>(new Map());
  const completingLessonsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      if (!courseId) {
        setErrorMessage("Invalid course ID.");
        setLoading(false);
        return;
      }

      try {
        const [courseData, learningContent, allProgress] = await Promise.all([
          courseService.getCourse(courseId),
          courseService.getLearningContent(courseId),
          courseProgressService.getMyProgress(),
        ]);

        if (!isMounted) return;

        setCourse(courseData);
        setChapters(learningContent.chapters);

        const courseProgress =
          allProgress.find((item) => item.courseId === courseId) ?? null;

        setProgress(courseProgress);

        const availableLessons = learningContent.chapters.flatMap((chapter) =>
          chapter.lessons.map((lesson) => ({
            chapterId: chapter.chapterId,
            lesson,
          })),
        );

        if (availableLessons.length === 0) {
          setLoading(false);
          return;
        }

        const resumeLesson = courseProgress?.lastAccessedLessonId
          ? availableLessons.find(
              (item) =>
                item.lesson.lessonId === courseProgress.lastAccessedLessonId,
            )
          : undefined;

        const initialLesson = resumeLesson ?? availableLessons[0];

        const lessonData = await lessonService.getStudentLesson(
          courseId,
          initialLesson.chapterId,
          initialLesson.lesson.lessonId,
        );

        if (!isMounted) return;

        setSelectedLesson(lessonData);
        setSelectedLessonId(initialLesson.lesson.lessonId);
        setErrorMessage(null);
        setLoading(false);

        try {
          await courseProgressService.recordLessonAccess(
            courseId,
            initialLesson.lesson.lessonId,
          );
        } catch (error) {
          if (isMounted) {
            setErrorMessage(getApiErrorMessage(error));
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getApiErrorMessage(error));
          setLoading(false);
        }
      }
    };

    void loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleSelectLesson = async (
    chapterId: string,
    lesson: LessonPreview,
  ) => {
    if (!courseId || lesson.lessonId === selectedLessonId) return;

    try {
      setLessonLoading(true);
      setErrorMessage(null);

      const lessonData = await lessonService.getStudentLesson(
        courseId,
        chapterId,
        lesson.lessonId,
      );

      setSelectedLesson(lessonData);
      setSelectedLessonId(lesson.lessonId);

      await courseProgressService.recordLessonAccess(courseId, lesson.lessonId);

      setProgress((previous) =>
        previous
          ? {
              ...previous,
              lastAccessedLessonId: lesson.lessonId,
            }
          : previous,
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLessonLoading(false);
    }
  };

  const allLessons: LessonPosition[] = chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      chapterId: chapter.chapterId,
      lesson,
    })),
  );

  const currentIndex = allLessons.findIndex(
    (item) => item.lesson.lessonId === selectedLessonId,
  );

  const completedLessonIds = progress?.completedLessonIds ?? [];

  const isCurrentLessonCompleted =
    completedLessonIds.includes(selectedLessonId);

  const navigateLesson = async (direction: "previous" | "next") => {
    const nextIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;

    const nextLesson = allLessons[nextIndex];

    if (nextLesson) {
      await handleSelectLesson(nextLesson.chapterId, nextLesson.lesson);
    }
  };

  // Refresh course progress from the backend.
  const refreshCourseProgress = async () => {
    if (!courseId) return;

    const allProgress = await courseProgressService.getMyProgress();

    const updatedProgress =
      allProgress.find((item) => item.courseId === courseId) ?? null;

    setProgress(updatedProgress);
  };

  const handleVideoProgress = async (lessonId: string, percentage: number) => {
    if (!courseId || !lessonId) return;

    const now = Date.now();
    const lastSavedAt = lastVideoSaveTimeRef.current.get(lessonId) ?? 0;

    if (now - lastSavedAt >= 10_000) {
      lastVideoSaveTimeRef.current.set(lessonId, now);

      try {
        await courseProgressService.saveVideoProgress(
          courseId,
          lessonId,
          percentage,
        );
      } catch (error) {
        console.error("Unable to save video progress:", error);
      }
    }

    if (
      percentage < 90 ||
      completingLessonsRef.current.has(lessonId) ||
      completedLessonIds.includes(lessonId)
    ) {
      return;
    }

    completingLessonsRef.current.add(lessonId);

    try {
      await courseProgressService.completeLesson(courseId, lessonId);
      await refreshCourseProgress();
    } catch (error) {
      console.error("Unable to complete video lesson:", error);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      completingLessonsRef.current.delete(lessonId);
    }
  };

  const handleReadingComplete = async (lessonId: string) => {
    if (
      !courseId ||
      !lessonId ||
      completedLessonIds.includes(lessonId) ||
      completingLessonsRef.current.has(lessonId)
    ) {
      return;
    }

    completingLessonsRef.current.add(lessonId);

    try {
      await courseProgressService.completeLesson(courseId, lessonId);
      await refreshCourseProgress();
    } catch (error) {
      console.error("Unable to complete reading lesson:", error);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      completingLessonsRef.current.delete(lessonId);
    }
  };

  const progressPercentage = Math.min(
    100,
    Math.max(0, progress?.progressPercentage ?? 0),
  );

  const completedAssignments = progress?.completedRequiredAssignments ?? 0;

  const totalRequiredAssignments = progress?.totalRequiredAssignments ?? 0;

  const remainingAssignments = progress?.remainingRequiredAssignments ?? 0;

  const assignmentProgressPercentage =
    totalRequiredAssignments > 0
      ? (completedAssignments / totalRequiredAssignments) * 100
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentNavbar />
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-4 text-sm text-slate-500">
              Preparing your learning experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && !selectedLesson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentNavbar />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Unable to load course
          </h2>
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          <Link
            to="/student/my-learning"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to My Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar />

      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto max-w-[1600px]">
          <Link
            to="/student/my-learning"
            className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={15} />
            My Learning
          </Link>

          <h1 className="text-xl font-bold text-slate-900">{course?.title}</h1>

          {course?.subtitle && (
            <p className="mt-1 text-sm text-slate-500">{course.subtitle}</p>
          )}

          {/* Overall course progress */}
          <div className="mt-5 max-w-2xl">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">
                Course progress
              </span>
              <span className="font-bold text-indigo-600">
                {progressPercentage}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Lesson progress */}
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                <span>
                  Lessons: {progress?.completedLessons ?? 0} /{" "}
                  {progress?.totalLessons ?? allLessons.length} completed
                </span>
                <span>
                  {progress?.remainingLessons ?? allLessons.length} lessons
                  remaining
                </span>
              </div>

              {/* Required assignment progress */}
              {totalRequiredAssignments > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Required assignments
                    </h3>
                    <span className="text-sm font-semibold text-indigo-600">
                      {completedAssignments} / {totalRequiredAssignments}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{
                        width: `${assignmentProgressPercentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {remainingAssignments} required assignments remaining
                  </p>
                </div>
              )}

              {/* Course completion */}
              {progress?.isCompleted && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle2 className="shrink-0 text-green-600" size={22} />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      Course completed!
                    </p>
                    <p className="mt-1 text-xs text-green-600">
                      You have completed all lessons and required assignments.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-r border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]">
          <LearningSidebar
            chapters={chapters}
            selectedLessonId={selectedLessonId}
            completedLessonIds={completedLessonIds}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        <main className="min-w-0 p-4 sm:p-7 lg:p-10">
          {errorMessage && selectedLesson && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {chapters.length === 0 || allLessons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                Course content is not available yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                The instructor hasn't added any lessons.
              </p>
            </div>
          ) : lessonLoading ? (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-sm text-slate-500">Loading lesson...</p>
              </div>
            </div>
          ) : selectedLesson ? (
            <>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Lesson {selectedLesson.order}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedLesson.title}
                </h2>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  {isCurrentLessonCompleted ? (
                    <span className="flex items-center gap-2 font-medium text-green-600">
                      <CheckCircle2 size={17} />
                      Lesson completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-slate-500">
                      <Circle size={17} />
                      Not completed
                    </span>
                  )}
                </div>
              </div>

              <LessonContentViewer
                lesson={selectedLesson}
                onVideoProgress={handleVideoProgress}
                onReadingComplete={handleReadingComplete}
              />

              <AssignmentPanel
                key={selectedLesson.lessonId}
                lessonId={selectedLesson.lessonId}
                onAssignmentSubmitted={refreshCourseProgress}
              />

              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                  type="button"
                  disabled={currentIndex <= 0 || lessonLoading}
                  onClick={() => void navigateLesson("previous")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <span className="text-xs text-slate-500">
                  {currentIndex + 1} of {allLessons.length} lessons
                </span>

                <button
                  type="button"
                  disabled={
                    currentIndex < 0 ||
                    currentIndex >= allLessons.length - 1 ||
                    lessonLoading
                  }
                  onClick={() => void navigateLesson("next")}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <RefreshCw className="mx-auto text-slate-400" size={30} />
              <p className="mt-4 text-sm text-slate-500">
                Select a lesson to begin.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
