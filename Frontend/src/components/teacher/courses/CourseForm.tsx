import { useState, type FormEvent } from "react";

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

  onSubmit: (data: CreateCourseRequest) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
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
  {
    label: "Beginner",
    value: "Beginner",
  },

  {
    label: "Intermediate",
    value: "Intermediate",
  },

  {
    label: "Advanced",
    value: "Advanced",
  },
];

export function CourseForm({
  categories,
  initialValues,
  submitLabel = "Create Course",
  onSubmit,
  onCancel,
  loading = false,
}: CourseFormProps) {
  const [form, setForm] = useState<CreateCourseRequest>({
    ...defaultValues,
    ...initialValues,
  });

  const [error, setError] = useState<string>();

  const updateField = <K extends keyof CreateCourseRequest>(
    field: K,
    value: CreateCourseRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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

    await onSubmit({
      ...form,

      title: form.title.trim(),

      subtitle: form.subtitle.trim(),

      description: form.description.trim(),
    });
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
        <h3
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          Basic Information
        </h3>

        {/* Category */}

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

        {/* Title */}

        <Input
          id="course-title"
          label="Course Title"
          placeholder="Enter course title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />

        {/* Subtitle */}

        <Input
          id="course-subtitle"
          label="Subtitle"
          placeholder="Short description of your course"
          value={form.subtitle}
          onChange={(event) => updateField("subtitle", event.target.value)}
        />

        {/* Description */}

        <Textarea
          id="course-description"
          label="Description"
          placeholder="Describe what students will learn..."
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </section>

      {/* Course Settings */}

      <section className="space-y-4">
        <h3
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          Course Settings
        </h3>

        <div
          className="
            grid
            gap-4
            md:grid-cols-3
          "
        >
          {/* Language */}

          <Input
            id="course-language"
            label="Language"
            value={form.language}
            onChange={(event) => updateField("language", event.target.value)}
          />

          {/* Level */}

          <Select
            id="course-level"
            label="Level"
            value={form.level}
            onChange={(event) =>
              updateField("level", event.target.value as CourseLevel)
            }
            options={levelOptions}
          />

          {/* Duration */}

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
        <h3
          className="
            text-sm
            font-semibold
            text-white
          "
        >
          Pricing
        </h3>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >
          {/* Price */}

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

          {/* Discount */}

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
