import { Link } from "react-router-dom";

import { usePublishedCourses } from "../../hooks/usePublishedCourses";

import CourseGrid from "../course/CourseGrid";
import CourseListState from "../course/CourseListState";

export function TrendingCoursesSection() {
  const { courses, isLoading, errorMessage } = usePublishedCourses();

  const trendingCourses = courses.slice(0, 4);

  return (
    <section id="courses" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Explore Courses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Discover courses published by our instructors.
          </p>
        </div>

        <Link
          to="/courses"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View All →
        </Link>
      </div>

      <CourseListState
        isLoading={isLoading}
        errorMessage={errorMessage}
        isEmpty={!isLoading && !errorMessage && trendingCourses.length === 0}
      />

      {!isLoading && !errorMessage && trendingCourses.length > 0 && (
        <CourseGrid courses={trendingCourses} />
      )}
    </section>
  );
}
