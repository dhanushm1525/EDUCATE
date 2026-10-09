import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

import type { Chapter } from "../../../types/chapter";

interface ChapterListProps {
  chapters: Chapter[];
  expandedChapterId?: string;
  onToggle: (chapterId: string) => void;
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapter: Chapter) => void;
  onAddLesson: (chapter: Chapter) => void;
}

export function ChapterList({
  chapters,
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

        return (
          <div
            key={chapter.chapterId}
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <button
                type="button"
                onClick={() => onToggle(chapter.chapterId)}
                className="text-slate-400 hover:text-white"
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

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(chapter)}
                  className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(chapter)}
                  className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {expanded && (
              <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lessons
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add lessons to this chapter.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddLesson(chapter)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
                  >
                    <Plus size={14} />
                    Add Lesson
                  </button>
                </div>

                <div className="rounded-md border border-dashed border-slate-700 p-5 text-center">
                  <p className="text-xs text-slate-500">
                    Lesson management will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}