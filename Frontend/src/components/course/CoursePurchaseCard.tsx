
import type { Course } from "../../types/course";

import {
  BookOpen,
  LoaderCircle,
} from "lucide-react";

interface CoursePurchaseCardProps {
  course: Course;
  onEnroll: () => void;
  onGoToLearning: () => void;
  isEnrolled: boolean;
  enrolling: boolean;
  checkingEnrollment: boolean;
}

function formatPrice(price: number): string {
  if (price <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

function formatDuration(duration: number): string {
  if (duration <= 0) {
    return "Not specified";
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 0) {
    return `${minutes} minutes`;
  }

  if (minutes === 0) {
    return `${hours} hours`;
  }

  return `${hours} hours ${minutes} minutes`;
}

export default function CoursePurchaseCard({
  course,
  onEnroll,
  onGoToLearning,
  isEnrolled,
  enrolling,
  checkingEnrollment,
}: CoursePurchaseCardProps) {
  const hasDiscount =
    course.price > 0 &&
    course.discount > 0 &&
    course.finalPrice < course.price;

  const savings = hasDiscount
    ? course.price - course.finalPrice
    : 0;

  const isFree = course.finalPrice <= 0;

  const buttonDisabled =
    checkingEnrollment ||
    enrolling ||
    (!isFree && !isEnrolled);

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-lg font-bold text-slate-900">
        {isEnrolled ? "Your course" : "Get this course"}
      </h2>

      {/* Price */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-extrabold text-slate-900">
            {formatPrice(course.finalPrice)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(course.price)}
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-semibold text-green-700">
              {course.discount}% off
            </p>

            <p className="text-xs text-slate-500">
              You save {formatPrice(savings)}
            </p>
          </div>
        )}
      </div>

      {/* Enrollment button */}
      <button
        type="button"
        onClick={
          isEnrolled ? onGoToLearning : onEnroll
        }
        disabled={buttonDisabled}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkingEnrollment || enrolling ? (
          <>
            <LoaderCircle
              size={17}
              className="animate-spin"
            />

            {checkingEnrollment
              ? "Checking enrollment..."
              : "Enrolling..."}
          </>
        ) : isEnrolled ? (
          <>
            <BookOpen size={17} />
            Go to Learning
          </>
        ) : isFree ? (
          "Enroll for free"
        ) : (
          "Payment coming soon"
        )}
      </button>

      {!isFree && !isEnrolled && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Online payment will be available soon.
        </p>
      )}

      {/* Course information */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="font-semibold text-slate-900">
          Course information
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex justify-between gap-3">
            <span>Level</span>

            <span className="font-medium text-slate-900">
              {course.level}
            </span>
          </li>

          <li className="flex justify-between gap-3">
            <span>Language</span>

            <span className="font-medium text-slate-900">
              {course.language || "Not specified"}
            </span>
          </li>

          <li className="flex justify-between gap-3">
            <span>Duration</span>

            <span className="text-right font-medium text-slate-900">
              {formatDuration(course.duration)}
            </span>
          </li>

          <li className="flex justify-between gap-3">
            <span>Students</span>

            <span className="font-medium text-slate-900">
              {course.totalStudents ?? 0}
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
