import {
  ChevronDown,
  ChevronRight,
  FileText,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";

import type { Chapter } from "../../../types/chapter";
import type { Lesson } from "../../../types/lesson";

interface ChapterListProps {
  chapters: Chapter[];
  lessonsByChapter: Record<string, Lesson[]>;
  expandedChapterId?: string;
  onToggle: (chapterId: string) => void;
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapter: Chapter) => void;
  onAddLesson: (chapter: Chapter) => void;
}

export function ChapterList({
  chapters,
  lessonsByChapter,
  expandedChapterId,
  onToggle,
  onEdit,
  onDelete,
  onAddLesson,
}: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
        <p className="text-sm text-slate-400">
          No chapters have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chapters.map((chapter) => {
        const expanded = expandedChapterId === chapter.chapterId;

        const lessons = lessonsByChapter[chapter.chapterId] ?? [];

        return (
          <div
            key={chapter.chapterId}
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          >
            {/* Chapter header */}
            <div className="flex items-center gap-3 px-5 py-4">
              <button
                type="button"
                onClick={() => onToggle(chapter.chapterId)}
                className="text-slate-400 hover:text-white"
                aria-label={expanded ? "Collapse chapter" : "Expand chapter"}
              >
                {expanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-xs font-semibold text-blue-400">
                {chapter.order}
              </div>

              <button
                type="button"
                onClick={() => onToggle(chapter.chapterId)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium text-white">
                  {chapter.title}
                </p>

                {chapter.description && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {chapter.description}
                  </p>
                )}
              </button>

              <span className="hidden rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400 sm:inline-flex">
                {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(chapter)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Edit chapter"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(chapter)}
                  className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete chapter"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Expanded chapter content */}
            {expanded && (
              <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lessons
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {lessons.length > 0
                        ? `${lessons.length} lessons in this chapter`
                        : "Add lessons to this chapter."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddLesson(chapter)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
                  >
                    <Plus size={14} />
                    Add Lesson
                  </button>
                </div>

                {lessons.length === 0 ? (
                  <div className="rounded-md border border-dashed border-slate-700 p-5 text-center">
                    <p className="text-sm text-slate-400">
                      No lessons have been added yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Use Add Lesson to create the first lesson in this chapter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.lessonId}
                        className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 transition-colors hover:border-slate-700"
                      >
                        {/* Lesson order */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800 text-xs font-medium text-slate-300">
                          {String(lesson.order).padStart(2, "0")}
                        </div>

                        {/* Lesson icon */}
                        <div className="text-slate-400">
                          {lesson.type === "video" ? (
                            <PlayCircle size={18} />
                          ) : (
                            <FileText size={18} />
                          )}
                        </div>

                        {/* Lesson information */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {lesson.title}
                          </p>

                          {lesson.description && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {lesson.description}
                            </p>
                          )}
                        </div>

                        {/* Lesson type */}
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            lesson.type === "video"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {lesson.type === "video" ? "Video" : "Reading"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
