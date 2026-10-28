
import { useCallback, useEffect, useState } from "react";

import { courseService } from "../services/course.service";
import type { Course, CourseSearchFilters } from "../types/course";

interface CourseLoadResult {
    requestKey: string;
    courses: Course[];
    errorMessage: string | null;
}

interface UsePublishedCoursesResult {
    courses: Course[];
    isLoading: boolean;
    errorMessage: string | null;
    refetch: () => Promise<void>;
}

export function usePublishedCourses(
    filters: CourseSearchFilters = {},
): UsePublishedCoursesResult {
    const [refreshKey, setRefreshKey] = useState(0);

    const [result, setResult] = useState<CourseLoadResult>({
        requestKey: "",
        courses: [],
        errorMessage: null,
    });

    const search = filters.search;
    const categoryId = filters.categoryId;
    const level = filters.level;
    const minPrice = filters.minPrice;
    const maxPrice = filters.maxPrice;

    const requestKey = JSON.stringify([
        search ?? "",
        categoryId ?? "",
        level ?? "",
        minPrice ?? null,
        maxPrice ?? null,
        refreshKey,
    ]);

    const refetch = useCallback(async (): Promise<void> => {
        setRefreshKey((current) => current + 1);
    }, []);

    useEffect(() => {
        let isActive = true;

        const loadCourses = async (): Promise<void> => {
            try {
                const courses = await courseService.getCourses({
                    search,
                    categoryId,
                    level,
                    minPrice,
                    maxPrice,
                });

                if (isActive) {
                    setResult({
                        requestKey,
                        courses,
                        errorMessage: null,
                    });
                }
            } catch {
                if (isActive) {
                    setResult({
                        requestKey,
                        courses: [],
                        errorMessage:
                            "Unable to load published courses. Please try again.",
                    });
                }
            }
        };

        void loadCourses();

        return () => {
            isActive = false;
        };
    }, [
        search,
        categoryId,
        level,
        minPrice,
        maxPrice,
        requestKey,
    ]);

    const isCurrentResult = result.requestKey === requestKey;

    return {
        courses: isCurrentResult ? result.courses : [],
        isLoading: !isCurrentResult,
        errorMessage: isCurrentResult ? result.errorMessage : null,
        refetch,
    };
}
