import { BookOpen, Plus } from "lucide-react";

import { Button } from "../../common/ui/Button";

interface MyCoursesEmptyStateProps {
  onCreateCourse: () => void;
}

export default function MyCoursesEmptyState({
  onCreateCourse,
}: MyCoursesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-14 text-center">
      <div className="rounded-full bg-indigo-500/10 p-4">
        <BookOpen size={28} className="text-indigo-400" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">No courses yet</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        You haven't created any courses yet. Start building your first course
        and share your knowledge with learners.
      </p>

      <Button className="mt-6" onClick={onCreateCourse}>
        <Plus size={16} />
        Create Your First Course
      </Button>
    </div>
  );
}
