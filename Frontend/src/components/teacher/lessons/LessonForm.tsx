import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Textarea } from "../../common/ui/Textarea";

import { LessonType } from "../../../constants/lesson";

import type { CreateLessonRequest } from "../../../types/lesson";

interface LessonFormProps {
  initialValues?: Partial<CreateLessonRequest>;
  submitLabel?: string;
  onSubmit: (data: CreateLessonRequest, videoFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const defaultValues: CreateLessonRequest = {
  title: "",
  description: "",
  order: 1,
  type: LessonType.VIDEO,
  videoUrl: "",
  content: "",
  attachments: [],
  duration: undefined,
};

export function LessonForm({
  initialValues,
  submitLabel = "Create Lesson",
  onSubmit,
  onCancel,
  loading = false,
}: LessonFormProps) {
  const [form, setForm] = useState<CreateLessonRequest>({
    ...defaultValues,
    ...initialValues,
  });

  const [videoFile, setVideoFile] = useState<File>();
  const [error, setError] = useState<string>();

  const updateField = <K extends keyof CreateLessonRequest>(
    field: K,
    value: CreateLessonRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setVideoFile(file);
  };

  const handleTypeChange = (type: LessonType) => {
    updateField("type", type);
    setError(undefined);

    if (type === LessonType.VIDEO) {
      updateField("content", undefined);
    } else {
      updateField("videoUrl", undefined);
      setVideoFile(undefined);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: string[] = [];

    if (!form.title.trim()) {
      errors.push("Lesson title is required");
    }

    if (form.order < 1) {
      errors.push("Lesson order must be at least 1");
    }

    if (form.type === LessonType.VIDEO && !form.videoUrl && !videoFile) {
      errors.push("Video lesson requires a video");
    }

    if (form.type === LessonType.READING && !form.content?.trim()) {
      errors.push("Reading lesson requires content");
    }

    if (errors.length) {
      setError(errors.join("\n"));
      return;
    }

    setError(undefined);

    await onSubmit(
      {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        order: form.order,
        type: form.type,
        videoUrl: form.videoUrl,
        content: form.content,
        attachments: form.attachments,
        duration: form.duration,
      },
      videoFile,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="whitespace-pre-line rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Input
        id="lesson-title"
        label="Lesson Title"
        placeholder="Enter lesson title"
        value={form.title}
        onChange={(event) => updateField("title", event.target.value)}
      />

      <Textarea
        id="lesson-description"
        label="Description"
        placeholder="Describe this lesson..."
        value={form.description ?? ""}
        onChange={(event) => updateField("description", event.target.value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="lesson-order"
          label="Order"
          type="number"
          min={1}
          value={form.order}
          onChange={(event) => updateField("order", Number(event.target.value))}
        />

        <Input
          id="lesson-duration"
          label="Duration (minutes)"
          type="number"
          min={1}
          value={form.duration ?? ""}
          onChange={(event) =>
            updateField(
              "duration",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
        />
      </div>

      {/* Lesson type */}
      <div className="space-y-2">
        <label className="block text-[11px] font-medium uppercase tracking-wide text-slate-300">
          Lesson Type
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange(LessonType.VIDEO)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              form.type === LessonType.VIDEO
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <p className="text-sm font-medium text-white">Video</p>
            <p className="mt-1 text-xs text-slate-500">
              Teach through a video lesson.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange(LessonType.READING)}
            className={`rounded-lg border px-4 py-3 text-left transition ${
              form.type === LessonType.READING
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-800"
            }`}
          >
            <p className="text-sm font-medium text-white">Reading</p>
            <p className="mt-1 text-xs text-slate-500">
              Teach through written content.
            </p>
          </button>
        </div>
      </div>

      {/* Video */}
      {form.type === LessonType.VIDEO && (
        <div className="space-y-2">
          <label
            htmlFor="lesson-video"
            className="block text-[11px] font-medium uppercase tracking-wide text-slate-300"
          >
            Video
          </label>

          <input
            id="lesson-video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
          />

          {videoFile && (
            <p className="text-xs text-slate-500">
              Selected: {videoFile.name}
            </p>
          )}

          {form.videoUrl && !videoFile && (
            <p className="text-xs text-emerald-400">Existing video attached</p>
          )}
        </div>
      )}

      {/* Reading content */}
      {form.type === LessonType.READING && (
        <Textarea
          id="lesson-content"
          label="Lesson Content"
          placeholder="Write the lesson content..."
          rows={12}
          value={form.content ?? ""}
          onChange={(event) => updateField("content", event.target.value)}
        />
      )}

      <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}