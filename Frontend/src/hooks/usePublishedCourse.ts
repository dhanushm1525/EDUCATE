
import { useEffect, useState } from "react";

import { courseService } from "../services/course.service";
import type { Course } from "../types/course";
import { getApiErrorMessage } from "../utils/apiError";

interface UsePublishedCourseResult {
    course: Course | null;
    isLoading: boolean;
    errorMessage: string | null;
}

export function usePublishedCourse(
    courseId: string | undefined,
): UsePublishedCourseResult {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        if (!courseId) {
            return () => {
                isActive = false;
            };
        }

        const loadCourse = async (): Promise<void> => {
            try {
                const result = await courseService.getCourse(courseId);

                if (isActive) {
                    setCourse(result);
                    setErrorMessage(null);
                }
            } catch (error: unknown) {
                if (isActive) {
                    setCourse(null);
                    setErrorMessage(getApiErrorMessage(error));
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void loadCourse();

        return () => {
            isActive = false;
        };
    }, [courseId]);

    return {
        course,
        isLoading: courseId ? isLoading : false,
        errorMessage: courseId
            ? errorMessage
            : "A course ID is required.",
    };
}
