import { BookOpen, Pencil, PlayCircle, Trash2 } from "lucide-react";

import { LessonType } from "../../../constants/lesson";

import type { Lesson } from "../../../types/lesson";

interface LessonListProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
  onAssignment: (lesson: Lesson) => void;
}

export function LessonList({
  lessons,
  onEdit,
  onDelete,
  onAssignment,
}: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">
        <p className="text-xs text-slate-500">No lessons created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => {
        const isVideo = lesson.type === LessonType.VIDEO;

        return (
          <div
            key={lesson.lessonId}
            className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800 text-xs text-slate-400">
              {lesson.order}
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
              {isVideo ? <PlayCircle size={16} /> : <BookOpen size={16} />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {lesson.title}
              </p>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span>{isVideo ? "Video" : "Reading"}</span>

                {lesson.duration && (
                  <>
                    <span>•</span>
                    <span>{lesson.duration} min</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAssignment(lesson)}
              className="rounded-md px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Assignment
            </button>

            <button
              type="button"
              onClick={() => onEdit(lesson)}
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(lesson)}
              className="rounded-md p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}