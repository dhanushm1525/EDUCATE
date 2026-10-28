import type { Course } from "../../types/course";

import CourseOverview from "./CourseOverview";
import CourseLearningContent from "./CourseLearningContent";
import CoursePurchaseCard from "./CoursePurchaseCard";

interface CourseDetailsContentProps {
  course: Course;
}

export default function CourseDetailsContent({
  course,
}: CourseDetailsContentProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
      {/* Main course information */}
      <div className="min-w-0 space-y-8">
        <CourseOverview course={course} />

        <CourseLearningContent course={course} />
      </div>

      {/* Pricing and enrollment information */}
      <div className="lg:sticky lg:top-6">
        <CoursePurchaseCard course={course} />
      </div>
    </div>
  );
}
