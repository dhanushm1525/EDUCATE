import { useState, type FormEvent } from "react";

import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Textarea } from "../../common/ui/Textarea";
import { TagInput } from "../../common/ui/TagInput";

import type { CreateChapterRequest } from "../../../types/chapter";

interface ChapterFormProps {
  initialValues?: Partial<CreateChapterRequest>;

  submitLabel?: string;

  onSubmit: (data: CreateChapterRequest) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
}

const defaultValues: CreateChapterRequest = {
  title: "",

  description: "",

  order: 1,

  outcomes: [],
};

export function ChapterForm({
  initialValues,
  submitLabel = "Create Chapter",
  onSubmit,
  onCancel,
  loading = false,
}: ChapterFormProps) {
  const [form, setForm] = useState<CreateChapterRequest>({
    ...defaultValues,
    ...initialValues,
  });

  const [error, setError] = useState<string>();

  const updateField = <K extends keyof CreateChapterRequest>(
    field: K,
    value: CreateChapterRequest[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: string[] = [];

    if (!form.title.trim()) {
      errors.push("Chapter title is required");
    }

    if (form.order < 1) {
      errors.push("Chapter order must be at least 1");
    }

    if (errors.length) {
      setError(errors.join("\n"));

      return;
    }

    setError(undefined);

    await onSubmit({
      title: form.title.trim(),

      description: form.description?.trim() || undefined,

      order: form.order,

      outcomes: form.outcomes?.filter((item) => item.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <Input
        id="chapter-title"
        label="Chapter Title"
        placeholder="Enter chapter title"
        value={form.title}
        onChange={(event) => updateField("title", event.target.value)}
      />

      <Textarea
        id="chapter-description"
        label="Description"
        placeholder="Describe this chapter..."
        value={form.description ?? ""}
        onChange={(event) => updateField("description", event.target.value)}
      />

      <Input
        id="chapter-order"
        label="Order"
        type="number"
        min={1}
        value={form.order}
        onChange={(event) => updateField("order", Number(event.target.value))}
      />

      <TagInput
        label="Learning Outcomes"
        values={form.outcomes ?? []}
        onChange={(values) => updateField("outcomes", values)}
        placeholder="
                    Type an outcome and press Enter
                "
      />

      <div
        className="
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-slate-800
                    pt-4
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
