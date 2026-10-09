import { useState, type FormEvent } from "react";

import { Button } from "../../common/ui/Button";
import { Input } from "../../common/ui/Input";
import { Textarea } from "../../common/ui/Textarea";

import type { CreateCategoryRequest } from "../../../types/category";

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
}

export function CategoryForm({
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) {
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [error, setError] = useState<string>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required");
      return;
    }

    setError(undefined);

    await onSubmit({
      name: trimmedName,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="category-name"
        label="Category Name"
        placeholder="Enter category name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={error}
        maxLength={100}
      />

      <Textarea
        id="category-description"
        label="Description"
        placeholder="Provide a brief description of this category..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={500}
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
          Create Category
        </Button>
      </div>
    </form>
  );
}
