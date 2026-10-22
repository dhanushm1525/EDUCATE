import { Plus } from "lucide-react";

import { Button } from "../../common/ui/Button";

interface MyCoursesHeaderProps {
  onCreateCourse: () => void;
}

export default function MyCoursesHeader({
  onCreateCourse,
}: MyCoursesHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Courses</h1>

        <p className="mt-1 text-sm text-slate-400">
          Create, organize, and manage your courses.
        </p>
      </div>

      <Button onClick={onCreateCourse}>
        <Plus size={16} />
        Create Course
      </Button>
    </div>
  );
}
