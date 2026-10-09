import { useEffect, useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";

import { Button } from "../../components/common/ui/Button";
import { Modal } from "../../components/common/ui/Modal";
import { CategoryForm } from "../../components/admin/categories/CategoryForm";
import { CategoryTable } from "../../components/admin/categories/CategoryTable";

import { categoryService } from "../../services/category.service";

import { useToastStore } from "../../store/toastStore";

import { getApiErrorMessage } from "../../utils/apiError";

import type { Category, CreateCategoryRequest } from "../../types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const result = await categoryService.getCategories();

        if (cancelled) return;

        setCategories(result);
      } catch (error) {
        if (cancelled) return;

        addToast(getApiErrorMessage(error), "error");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(value) ||
        category.description?.toLowerCase().includes(value),
    );
  }, [categories, search]);

  const handleCreate = async (payload: CreateCategoryRequest) => {
    try {
      setCreating(true);

      const category = await categoryService.createCategory(payload);

      setCategories((current) => [category, ...current]);

      setShowCreateModal(false);

      addToast("Category created successfully", "success");
    } catch (error) {
      addToast(getApiErrorMessage(error), "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-6 text-white">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage and organize course categories available on the EDUCATE
            platform.
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {/* Filters */}

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-md border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">
          Loading categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-sm text-slate-400">No categories found.</p>
        </div>
      ) : (
        <CategoryTable categories={filteredCategories} />
      )}

      {/* Create Modal */}

      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Category"
        description="Create a new course category for the EDUCATE platform."
        width="md"
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
        />
      </Modal>
    </div>
  );
}
