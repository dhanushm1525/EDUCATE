import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Clock, PlayCircle, Video } from "lucide-react";

import type { Course } from "../../types/course";
import type {
  ChapterPreview,
  CourseLearningContent,
} from "../../types/courseLearningContent";

import { courseService } from "../../services/course.service";
import { getApiErrorMessage } from "../../utils/apiError";

interface CourseLearningContentProps {
  course: Course;
}

export default function CourseLearningContent({
  course,
}: CourseLearningContentProps) {
  const [learningContent, setLearningContent] =
    useState<CourseLearningContent | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const loadLearningContent = async () => {
      try {
        const result = await courseService.getLearningContent(course.courseId);

        if (isActive) {
          setLearningContent(result);
          setErrorMessage(null);

          // Expand the first chapter by default.
          setExpandedChapters(
            result.chapters[0]?.chapterId ? [result.chapters[0].chapterId] : [],
          );
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(getApiErrorMessage(error));
          setLearningContent(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadLearningContent();

    return () => {
      isActive = false;
    };
  }, [course.courseId]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((previous) =>
      previous.includes(chapterId)
        ? previous.filter((id) => id !== chapterId)
        : [...previous, chapterId],
    );
  };

  const totalLessons =
    learningContent?.chapters.reduce(
      (total, chapter) => total + chapter.lessons.length,
      0,
    ) ?? 0;

  const formatDuration = (duration?: number) => {
    if (!duration || duration <= 0) {
      return null;
    }

    return `${duration} min`;
  };

  const renderChapter = (chapter: ChapterPreview) => {
    const isExpanded = expandedChapters.includes(chapter.chapterId);

    return (
      <div
        key={chapter.chapterId}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <button
          type="button"
          onClick={() => toggleChapter(chapter.chapterId)}
          aria-expanded={isExpanded}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {chapter.order}. {chapter.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {chapter.lessons.length}{" "}
                {chapter.lessons.length === 1 ? "lesson" : "lessons"}
              </p>
            </div>
          </div>

          <ChevronDown
            size={19}
            className={`shrink-0 text-slate-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-slate-200">
            {chapter.description && (
              <p className="px-5 py-3 text-sm leading-6 text-slate-600">
                {chapter.description}
              </p>
            )}

            {chapter.lessons.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {chapter.lessons.map((lesson) => {
                  const isVideo = lesson.type === "video";
                  const duration = formatDuration(lesson.duration);

                  return (
                    <div
                      key={lesson.lessonId}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {lesson.thumbnailUrl ? (
                          <img
                            src={lesson.thumbnailUrl}
                            alt={`${lesson.title} thumbnail`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            {isVideo ? (
                              <PlayCircle size={25} />
                            ) : (
                              <BookOpen size={25} />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-slate-900">
                          {lesson.order}. {lesson.title}
                        </h4>

                        {lesson.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {lesson.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            {isVideo ? (
                              <Video size={13} />
                            ) : (
                              <BookOpen size={13} />
                            )}

                            {isVideo ? "Video lesson" : "Reading"}
                          </span>

                          {duration && (
                            <span className="inline-flex items-center gap-1">
                              <Clock size={13} />
                              {duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
                        Preview
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="px-5 py-4 text-sm text-slate-500">
                No lessons available in this chapter.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-6">
      {/* Course description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">About this course</h2>

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
          {course.description || "No course description available."}
        </p>
      </div>

      {/* Learning objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            What you will learn
          </h2>

          <ul className="mt-4 space-y-3">
            {course.objectives.map((objective, index) => (
              <li
                key={`${index}-${objective}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-600"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700"
                >
                  ✓
                </span>

                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course requirements */}
      {course.requirements && course.requirements.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Requirements</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {course.requirements.map((requirement, index) => (
              <li key={`${index}-${requirement}`}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Course curriculum */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Course curriculum
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore the chapters and lessons included in this course.
            </p>
          </div>

          {!isLoading && learningContent && (
            <p className="text-xs font-medium text-slate-500">
              {learningContent.chapters.length} chapters · {totalLessons}{" "}
              lessons
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-12">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              Loading course curriculum...
            </div>
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        ) : !learningContent || learningContent.chapters.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <BookOpen size={30} className="mx-auto text-slate-400" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              Curriculum not available yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              The instructor has not added any chapters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {learningContent.chapters.map(renderChapter)}
          </div>
        )}
      </div>
    </section>
  );
}
