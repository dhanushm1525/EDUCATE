import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Textarea } from "../../common/ui/Textarea";
import { Select } from "../../common/ui/Select";

import type { Category } from "../../../types/category";
import type { CourseLevel, CreateCourseRequest } from "../../../types/course";

interface CourseFormProps {
  categories: Category[];
  initialValues?: Partial<CreateCourseRequest>;
  submitLabel?: string;
  onSubmit: (data: CreateCourseRequest, thumbnailFile?: File) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  uploadProgress?: number | null;
}

const defaultValues: CreateCourseRequest = {
  categoryId: "",
  title: "",
  subtitle: "",
  description: "",
  language: "English",
  level: "Beginner",
  duration: 0,
  price: 0,
  discount: 0,
};

const levelOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function CourseForm({
  categories,
  initialValues,
  submitLabel = "Create Course",
  onSubmit,
  onCancel,
  loading = false,
  uploadProgress = null,
}: CourseFormProps) {
  const [form, setForm] = useState<CreateCourseRequest>({
    ...defaultValues,
    ...initialValues,
  });

  const [error, setError] = useState<string>();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string>();

  const previewUrlRef = useRef<string | null>(null);

  // Revoke the preview URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const updateField = <K extends keyof CreateCourseRequest>(
    field: K,
    value: CreateCourseRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_THUMBNAIL_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError("Thumbnail image must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    // Revoke the previous preview URL before creating a new one.
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setThumbnailPreview(previewUrl);
    setThumbnailFile(file);
    setError(undefined);
  };

  const handleRemoveThumbnail = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setThumbnailPreview(undefined);
    setThumbnailFile(null);

    const input = document.getElementById(
      "course-thumbnail",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: string[] = [];

    if (!form.categoryId) {
      errors.push("Category is required");
    }

    if (!form.title.trim()) {
      errors.push("Course title is required");
    }

    if (!form.subtitle.trim()) {
      errors.push("Course subtitle is required");
    }

    if (!form.description.trim()) {
      errors.push("Course description is required");
    }

    if (form.duration <= 0) {
      errors.push("Duration must be greater than 0");
    }

    if (form.price < 0) {
      errors.push("Price cannot be negative");
    }

    if (form.discount < 0 || form.discount > 100) {
      errors.push("Discount must be between 0 and 100");
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    setError(undefined);

    await onSubmit(
      {
        ...form,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
      },
      thumbnailFile ?? undefined,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}

      {error && (
        <div
          className="
            whitespace-pre-line
            rounded-md
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* Basic Information */}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Basic Information</h3>

        <Select
          id="course-category"
          label="Category"
          value={form.categoryId}
          onChange={(event) => updateField("categoryId", event.target.value)}
          options={[
            {
              label: "Select category",
              value: "",
            },
            ...categories.map((category) => ({
              label: category.name,
              value: category.categoryId,
            })),
          ]}
        />

        <Input
          id="course-title"
          label="Course Title"
          placeholder="Enter course title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />

        <Input
          id="course-subtitle"
          label="Subtitle"
          placeholder="Short description of your course"
          value={form.subtitle}
          onChange={(event) => updateField("subtitle", event.target.value)}
        />

        <Textarea
          id="course-description"
          label="Description"
          placeholder="Describe what students will learn..."
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </section>

      {/* Course Thumbnail */}

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Course Thumbnail</h3>

          <p className="mt-1 text-xs text-slate-400">
            Upload a JPEG, PNG or WebP image. Maximum size: 5 MB.
          </p>
        </div>

        <label
          htmlFor="course-thumbnail"
          className="
            flex
            cursor-pointer
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-dashed
            border-slate-600
            bg-slate-950
            transition
            hover:border-indigo-500
          "
        >
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="Course thumbnail preview"
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="flex h-56 w-full flex-col items-center justify-center gap-2">
              <span className="text-3xl text-slate-500">+</span>

              <span className="text-sm font-medium text-slate-300">
                Choose course thumbnail
              </span>

              <span className="text-xs text-slate-500">JPEG, PNG or WebP</span>
            </div>
          )}
        </label>

        <input
          id="course-thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={loading}
          onChange={handleThumbnailChange}
        />

        {thumbnailFile && (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-300">
                {thumbnailFile.name}
              </p>

              <p className="text-xs text-slate-500">
                {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleRemoveThumbnail}
              className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        {uploadProgress !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Uploading thumbnail...</span>
              <span>{uploadProgress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Course Settings */}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Course Settings</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            id="course-language"
            label="Language"
            value={form.language}
            onChange={(event) => updateField("language", event.target.value)}
          />

          <Select
            id="course-level"
            label="Level"
            value={form.level}
            onChange={(event) =>
              updateField("level", event.target.value as CourseLevel)
            }
            options={levelOptions}
          />

          <Input
            id="course-duration"
            label="Duration (minutes)"
            type="number"
            min={1}
            value={form.duration === 0 ? "" : form.duration}
            onChange={(event) =>
              updateField("duration", Number(event.target.value))
            }
          />
        </div>
      </section>

      {/* Pricing */}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Pricing</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            id="course-price"
            label="Price"
            type="number"
            min={0}
            value={form.price === 0 ? "" : form.price}
            onChange={(event) =>
              updateField("price", Number(event.target.value))
            }
          />

          <Input
            id="course-discount"
            label="Discount (%)"
            type="number"
            min={0}
            max={100}
            value={form.discount === 0 ? "" : form.discount}
            onChange={(event) =>
              updateField("discount", Number(event.target.value))
            }
          />
        </div>
      </section>

      {/* Actions */}

      <div
        className="
          flex
          justify-end
          gap-3
          border-t
          border-slate-800
          pt-5
        "
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" loading={loading}>
          {uploadProgress !== null ? "Uploading..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
