import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { StudentNavbar } from "../../components/student/StudentNavbar";
import LearningSidebar from "../../components/student/learning/LearningSidebar";
import LessonContentViewer from "../../components/student/learning/LessonContentViewer";
import AssignmentPanel from "../../components/student/learning/AssignmentPanel";

import { courseService } from "../../services/course.service";
import { lessonService } from "../../services/lesson.service";
import { getApiErrorMessage } from "../../utils/apiError";

import type { Course } from "../../types/course";
import type {
  ChapterPreview,
  LessonPreview,
} from "../../types/courseLearningContent";
import type { StudentLesson } from "../../types/studentLesson";

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
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load course and its learning content
  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      if (!courseId) {
        setErrorMessage("Invalid course ID.");
        setLoading(false);
        return;
      }

      try {
        const [courseData, learningContent] = await Promise.all([
          courseService.getCourse(courseId),
          courseService.getLearningContent(courseId),
        ]);

        if (!isMounted) return;

        setCourse(courseData);
        setChapters(learningContent.chapters);

        const firstChapter = learningContent.chapters[0];
        const firstLesson = firstChapter?.lessons[0];

        if (!firstChapter || !firstLesson) {
          setLoading(false);
          return;
        }

        const lessonData = await lessonService.getStudentLesson(
          courseId,
          firstChapter.chapterId,
          firstLesson.lessonId,
        );

        if (isMounted) {
          setSelectedLesson(lessonData);
          setSelectedLessonId(firstLesson.lessonId);
          setErrorMessage(null);
          setLoading(false);
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

  // Select a lesson from the sidebar
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
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setLessonLoading(false);
    }
  };

  // Flatten lessons for previous/next navigation
  const allLessons: LessonPosition[] = chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      chapterId: chapter.chapterId,
      lesson,
    })),
  );

  const currentIndex = allLessons.findIndex(
    (item) => item.lesson.lessonId === selectedLessonId,
  );

  // Navigate between lessons
  const navigateLesson = async (direction: "previous" | "next") => {
    const nextIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;

    const nextLesson = allLessons[nextIndex];

    if (nextLesson) {
      await handleSelectLesson(nextLesson.chapterId, nextLesson.lesson);
    }
  };

  // Initial loading state
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

  // Course loading error
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

      {/* Course header */}
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
        </div>
      </div>

      {/* Learning layout */}
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Chapter and lesson sidebar */}
        <div className="border-r border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]">
          <LearningSidebar
            chapters={chapters}
            selectedLessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        {/* Main lesson content */}
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
              {/* Lesson heading */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Lesson {selectedLesson.order}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedLesson.title}
                </h2>
              </div>

              {/* Video or reading content */}
              <LessonContentViewer lesson={selectedLesson} />

              {/* Student assignment */}
              <AssignmentPanel
                key={selectedLesson.lessonId}
                lessonId={selectedLesson.lessonId}
              />

              {/* Previous and next navigation */}
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
