import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { usePublishedCourses } from "../../hooks/usePublishedCourses";
import type { CourseLevel, CourseSearchFilters } from "../../types/course";

import CourseGrid from "../../components/course/CourseGrid";
import CourseListState from "../../components/course/CourseListState";

import { categoryService } from "../../services/category.service";
import type { Category } from "../../types/category";

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<CourseSearchFilters>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const { courses, isLoading, errorMessage, refetch } =
    usePublishedCourses(filters);

  // Update an individual filter without removing the others.
  const updateFilter = <K extends keyof CourseSearchFilters>(
    key: K,
    value: CourseSearchFilters[K] | undefined,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // Apply the search input.
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateFilter("search", searchInput.trim() || undefined);
  };

  // Reset all search and filter values.
  const handleReset = () => {
    setSearchInput("");
    setFilters({});
  };

  // Fetch available categories.
  useEffect(() => {
    let isActive = true;

    const fetchCategories = async () => {
      try {
        const result = await categoryService.getCategories();

        if (isActive) {
          setCategories(
            result.filter((category) => category.status === "active"),
          );
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        if (isActive) {
          setIsLoadingCategories(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to home
        </Link>

        <header className="mb-8 mt-5">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Explore Courses
          </h1>

          <p className="mt-2 text-slate-500">
            Find courses that match your learning goals.
          </p>
        </header>

        {/* Search and filters */}
        <form
          onSubmit={handleSearch}
          className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Search */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </span>

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </label>

          {/* Category */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </span>

            <select
              value={filters.categoryId ?? ""}
              onChange={(event) =>
                updateFilter("categoryId", event.target.value || undefined)
              }
              disabled={isLoadingCategories}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {isLoadingCategories
                  ? "Loading categories..."
                  : "All categories"}
              </option>

              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {/* Level */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Level
            </span>

            <select
              value={filters.level ?? ""}
              onChange={(event) =>
                updateFilter(
                  "level",
                  (event.target.value || undefined) as CourseLevel | undefined,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
            >
              <option value="">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>

          {/* Minimum price */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Minimum price (₹)
            </span>

            <input
              type="number"
              min="0"
              value={filters.minPrice ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                updateFilter(
                  "minPrice",
                  value === "" ? undefined : Number(value),
                );
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              placeholder="No minimum"
            />
          </label>

          {/* Maximum price */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Maximum price (₹)
            </span>

            <input
              type="number"
              min="0"
              value={filters.maxPrice ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                updateFilter(
                  "maxPrice",
                  value === "" ? undefined : Number(value),
                );
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              placeholder="No maximum"
            />
          </label>

          {/* Actions */}
          <div className="flex flex-wrap items-end gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Search courses
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        </form>

        {/* Course count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Available courses
          </h2>

          {!isLoading && !errorMessage && (
            <span className="text-sm text-slate-500">
              {courses.length} courses
            </span>
          )}
        </div>

        {/* Loading, error and empty states */}
        <CourseListState
          isLoading={isLoading}
          errorMessage={errorMessage}
          isEmpty={!isLoading && !errorMessage && courses.length === 0}
        />

        {!isLoading && errorMessage && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Try again
          </button>
        )}

        {/* Course results */}
        {!isLoading && !errorMessage && courses.length > 0 && (
          <CourseGrid courses={courses} />
        )}
      </div>
    </main>
  );
}
