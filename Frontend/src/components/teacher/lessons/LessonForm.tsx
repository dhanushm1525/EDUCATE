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
    pdfFile?: File,
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const MAX_PDF_SIZE = 20 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

const defaultValues: CreateLessonRequest = {
  title: "",
  description: "",
  type: "video",
  videoUrl: "",
  thumbnailKey: "",
  content: "",
  attachments: [],
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
  const [pdfFile, setPdfFile] = useState<File>();

  const [thumbnailPreview, setThumbnailPreview] = useState(initialThumbnailUrl ?? "");

  const [error, setError] = useState("");

  const hasExistingPdf = Boolean(formData.attachments?.length);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

    if (file.size > MAX_THUMBNAIL_SIZE) {
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

  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setError("PDF size must not exceed 20 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setPdfFile(file);
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
        : {
            content: "",
            attachments: [],
          }),
    }));

    setVideoFile(undefined);
    setThumbnailFile(undefined);
    setPdfFile(undefined);
    setThumbnailPreview("");
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(undefined);
    setThumbnailPreview(initialThumbnailUrl ?? "");

    setFormData((previous) => ({
      ...previous,
      thumbnailKey: "",
    }));
  };

  const handleRemovePdf = () => {
    setPdfFile(undefined);

    setFormData((previous) => ({
      ...previous,
      attachments: [],
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

    if (formData.type === "reading" && !formData.content?.trim() && !pdfFile && !hasExistingPdf) {
      setError("Please provide reading content or upload a PDF.");
      return;
    }

    try {
      await onSubmit(formData, videoFile, thumbnailFile, pdfFile);
    } catch {
      setError("Unable to save lesson. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

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
              accept="video/mp4,video/webm"
              onChange={handleVideoChange}
              className="w-full rounded-lg border p-3"
            />

            {videoFile && <p className="mt-1 text-xs text-gray-500">Selected: {videoFile.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Custom Thumbnail (Optional)</label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-xs text-gray-500">
              If you do not upload a thumbnail, one will be generated automatically from the video.
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

      {formData.type === "reading" && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium">Reading Content</label>

            <textarea
              name="content"
              value={formData.content ?? ""}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border p-3"
              placeholder="Write the reading material here..."
            />

            <p className="mt-1 text-xs text-gray-500">
              You can provide text content, upload a PDF, or do both.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">PDF Attachment (Optional)</label>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePdfChange}
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-xs text-gray-500">Maximum file size: 20 MB.</p>

            {pdfFile && (
              <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{pdfFile.name}</span>

                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {!pdfFile && hasExistingPdf && (
              <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-gray-500">A PDF is already attached</span>

                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove existing PDF
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Duration (minutes)</label>

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
