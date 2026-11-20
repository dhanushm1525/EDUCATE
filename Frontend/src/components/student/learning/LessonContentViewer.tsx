import { useEffect, useRef } from "react";
import { FileText, Download, PlayCircle } from "lucide-react";

import type { StudentLesson } from "../../../types/studentLesson";

interface LessonContentViewerProps {
  lesson: StudentLesson;
  onVideoProgress?: (lessonId: string, percentage: number) => void;
  onReadingComplete?: (lessonId: string) => void;
}

export default function LessonContentViewer({
  lesson,
  onVideoProgress,
  onReadingComplete,
}: LessonContentViewerProps) {
  const readingEndRef = useRef<HTMLDivElement | null>(null);
  const readingCompleteCallbackRef = useRef(onReadingComplete);

  useEffect(() => {
    readingCompleteCallbackRef.current = onReadingComplete;
  }, [onReadingComplete]);

  useEffect(() => {
    if (lesson.type === "video" || !lesson.content || !readingEndRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          readingCompleteCallbackRef.current?.(lesson.lessonId);
        }
      },
      {
        root: null,
        threshold: 1,
      },
    );

    observer.observe(readingEndRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lesson.lessonId, lesson.type, lesson.content]);
  const handleVideoProgress = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const percentage = Math.min(
      100,
      Math.floor((video.currentTime / video.duration) * 100),
    );

    onVideoProgress?.(lesson.lessonId, percentage);
  };

  return (
    <div className="min-w-0">
      {lesson.type === "video" ? (
        <div className="overflow-hidden rounded-2xl bg-black">
          {lesson.videoUrl ? (
            <video
              key={lesson.lessonId}
              controls
              controlsList="nodownload"
              poster={lesson.thumbnailUrl}
              onTimeUpdate={handleVideoProgress}
              onEnded={handleVideoProgress}
              className="aspect-video w-full"
            >
              <source src={lesson.videoUrl} />
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center text-white">
              <PlayCircle size={48} className="mb-3 text-slate-400" />
              <p className="text-sm text-slate-300">
                Video is not available for this lesson.
              </p>
            </div>
          )}
        </div>
      ) : (
        <article className="min-h-96 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Reading material
              </p>
              <p className="text-xs text-slate-500">Study at your own pace</p>
            </div>
          </div>

          {lesson.content ? (
            <>
              <div className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-700">
                {lesson.content}
              </div>

              {/* Observed when the student reaches the end of the reading */}
              <div
                ref={readingEndRef}
                aria-hidden="true"
                className="h-px w-full"
              />
            </>
          ) : (
            <p className="text-sm text-slate-400">
              No reading content is available for this lesson.
            </p>
          )}
        </article>
      )}

      {lesson.description && (
        <div className="mt-7">
          <h2 className="text-lg font-bold text-slate-900">
            About this lesson
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            {lesson.description}
          </p>
        </div>
      )}

      {lesson.attachments.length > 0 && (
        <div className="mt-7">
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Lesson resources
          </h2>

          <div className="space-y-2">
            {lesson.attachments.map((url, index) => (
              <a
                key={`${lesson.lessonId}-${index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <FileText className="text-indigo-600" size={20} />

                <span className="flex-1 text-sm font-medium text-slate-700">
                  Resource {index + 1}
                </span>

                <Download size={17} className="text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
