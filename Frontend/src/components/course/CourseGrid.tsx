
import type { Course } from "../../types/course";
import CourseCard from "./CourseCard";

interface CourseGridProps {
    courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
                <CourseCard
                    key={course.courseId}
                    course={course}
                />
            ))}
        </div>
    );
}
