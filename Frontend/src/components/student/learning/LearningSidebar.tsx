import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
} from "lucide-react";

import type {
  ChapterPreview,
  LessonPreview,
} from "../../../types/courseLearningContent";

interface LearningSidebarProps {
  chapters: ChapterPreview[];
  selectedLessonId: string;
  onSelectLesson: (chapterId: string, lesson: LessonPreview) => void;
}

export default function LearningSidebar({
  chapters,
  selectedLessonId,
  onSelectLesson,
}: LearningSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(() =>
    chapters.map((chapter) => chapter.chapterId),
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((previous) =>
      previous.includes(chapterId)
        ? previous.filter((id) => id !== chapterId)
        : [...previous, chapterId],
    );
  };

  return (
    <aside className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={20} />
          <h2 className="font-bold text-slate-900">Course content</h2>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {chapters.length} chapters
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chapters.map((chapter, index) => {
          const isExpanded = expandedChapters.includes(chapter.chapterId);

          return (
            <div key={chapter.chapterId} className="border-b border-slate-100">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.chapterId)}
                className="flex w-full items-center justify-between p-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {chapter.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {chapter.lessons.length} lessons
                    </p>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown size={17} className="shrink-0 text-slate-400" />
                ) : (
                  <ChevronRight size={17} className="shrink-0 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-2">
                  {chapter.lessons.map((lesson) => {
                    const selected = selectedLessonId === lesson.lessonId;

                    return (
                      <button
                        key={lesson.lessonId}
                        type="button"
                        onClick={() =>
                          onSelectLesson(chapter.chapterId, lesson)
                        }
                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition ${
                          selected
                            ? "border-r-2 border-indigo-600 bg-indigo-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {lesson.type === "video" ? (
                          <PlayCircle
                            size={17}
                            className={
                              selected ? "text-indigo-600" : "text-slate-400"
                            }
                          />
                        ) : (
                          <FileText
                            size={17}
                            className={
                              selected ? "text-indigo-600" : "text-slate-400"
                            }
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm ${
                              selected
                                ? "font-semibold text-indigo-700"
                                : "text-slate-600"
                            }`}
                          >
                            {lesson.title}
                          </p>

                          {lesson.duration !== undefined && (
                            <p className="mt-1 text-xs text-slate-400">
                              {lesson.duration} minutes
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
