import type { Course } from "../../types/course";

interface CoursePurchaseCardProps {
  course: Course;
  onEnroll?: () => void;
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

  // Assumes duration is stored in minutes.
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
}: CoursePurchaseCardProps) {
  const hasDiscount =
    course.price > 0 && course.discount > 0 && course.finalPrice < course.price;

  const savings = hasDiscount ? course.price - course.finalPrice : 0;

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Get this course</h2>

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

      <button
        type="button"
        onClick={onEnroll}
        disabled={!onEnroll}
        className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {course.finalPrice <= 0 ? "Enroll for free" : "Enroll now"}
      </button>

      {!onEnroll && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Enrollment will be available soon.
        </p>
      )}

      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="font-semibold text-slate-900">Course information</h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex justify-between gap-3">
            <span>Level</span>
            <span className="font-medium text-slate-900">{course.level}</span>
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
