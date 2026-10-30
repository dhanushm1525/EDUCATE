import { useState, type ChangeEvent, type FormEvent } from "react";
import type { CreateLessonRequest } from "../../../types/lesson";

interface LessonFormProps {
  initialValues?: Partial<CreateLessonRequest>;
  initialThumbnailUrl?: string;
  submitLabel?: string;
  onSubmit: (
    data: CreateLessonRequest,
    videoFile?: File,
    thumbnailFile?: File,
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const defaultValues: CreateLessonRequest = {
  title: "",
  description: "",
  type: "video",
  videoUrl: "",
  thumbnailKey: "",
  duration: 0,
  order: 1,
};

export default function LessonForm({
  initialValues,
  initialThumbnailUrl,
  submitLabel = "Save Lesson",
  onSubmit,
  onCancel,
  loading = false,
}: LessonFormProps) {
  const [formData, setFormData] = useState<CreateLessonRequest>({
    ...defaultValues,
    ...initialValues,
  });

  const [videoFile, setVideoFile] = useState<File>();
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialThumbnailUrl ?? "",
  );
  const [error, setError] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "duration" || name === "order" ? Number(value) : value,
    }));
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      event.target.value = "";
      return;
    }

    setError("");
    setVideoFile(file);
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Thumbnail must be JPEG, PNG, or WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Thumbnail size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setThumbnailFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setThumbnailPreview(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Unable to preview the selected thumbnail.");
    };

    reader.readAsDataURL(file);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as CreateLessonRequest["type"];

    setFormData((previous) => ({
      ...previous,
      type,
      ...(type === "reading"
        ? {
            videoUrl: "",
            thumbnailKey: "",
          }
        : {}),
    }));

    if (type === "reading") {
      setVideoFile(undefined);
      setThumbnailFile(undefined);
      setThumbnailPreview("");
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(undefined);
    setThumbnailPreview(initialThumbnailUrl ?? "");

    setFormData((previous) => ({
      ...previous,
      thumbnailKey: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    if (formData.type === "video" && !videoFile && !formData.videoUrl) {
      setError("Please select a video file.");
      return;
    }

    try {
      await onSubmit(formData, videoFile, thumbnailFile);
    } catch {
      setError("Unable to save lesson. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Lesson Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
          placeholder="Enter lesson title"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description ?? ""}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border p-3"
          placeholder="Enter lesson description"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Lesson Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleTypeChange}
          className="w-full rounded-lg border p-3"
        >
          <option value="video">Video</option>
          <option value="reading">Reading</option>
        </select>
      </div>

      {formData.type === "video" && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full rounded-lg border p-3"
            />

            {videoFile && (
              <p className="mt-1 text-xs text-gray-500">
                Selected: {videoFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Custom Thumbnail (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className="w-full rounded-lg border p-3"
            />
            <p className="mt-1 text-xs text-gray-500">
              If you don't upload a thumbnail, one will be generated
              automatically from the video.
            </p>
          </div>

          {thumbnailPreview && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Thumbnail Preview</p>

              <img
                src={thumbnailPreview}
                alt="Lesson thumbnail preview"
                className="h-40 w-full rounded-lg border object-cover"
              />

              {thumbnailFile && (
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove selected thumbnail
                </button>
              )}
            </div>
          )}
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Duration (minutes)
        </label>
        <input
          type="number"
          name="duration"
          min={0}
          value={formData.duration ?? 0}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Lesson Order</label>
        <input
          type="number"
          name="order"
          min={1}
          value={formData.order ?? 1}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />
      </div>

     <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-700 bg-slate-900 py-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
