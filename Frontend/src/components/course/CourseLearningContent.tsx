import type { Course } from "../../types/course";

interface CourseLearningContentProps {
  course: Course;
}

export default function CourseLearningContent({
  course,
}: CourseLearningContentProps) {
  return (
    <section className="space-y-6">
      {/* Course description */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">About this course</h2>

        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
          {course.description || "No course description available."}
        </p>
      </div>

      {/* Learning objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            What you will learn
          </h2>

          <ul className="mt-4 space-y-3">
            {course.objectives.map((objective, index) => (
              <li
                key={`${index}-${objective}`}
                className="flex items-start gap-3 text-sm leading-6 text-slate-600"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700"
                >
                  ✓
                </span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course requirements */}
      {course.requirements && course.requirements.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Requirements</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {course.requirements.map((requirement, index) => (
              <li key={`${index}-${requirement}`}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
