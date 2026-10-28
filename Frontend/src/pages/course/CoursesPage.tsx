import { useState } from "react";
import { Link } from "react-router-dom";

import { usePublishedCourses } from "../../hooks/usePublishedCourses";
import type { CourseLevel, CourseSearchFilters } from "../../types/course";

import CourseGrid from "../../components/course/CourseGrid";
import CourseListState from "../../components/course/CourseListState";

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<CourseSearchFilters>({});

  const { courses, isLoading, errorMessage, refetch } =
    usePublishedCourses(filters);

  const updateFilter = <K extends keyof CourseSearchFilters>(
    key: K,
    value: CourseSearchFilters[K] | undefined,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFilter("search", searchInput.trim() || undefined);
  };

  const handleReset = () => {
    setSearchInput("");
    setFilters({});
  };

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

        <form
          onSubmit={handleSearch}
          className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 lg:grid-cols-4"
        >
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

          <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-4">
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

        {!isLoading && !errorMessage && courses.length > 0 && (
          <CourseGrid courses={courses} />
        )}
      </div>
    </main>
  );
}
