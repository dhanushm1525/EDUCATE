export const LessonType = {
    VIDEO: "video",
    READING: "reading",
} as const;

export type LessonType =
    (typeof LessonType)[keyof typeof LessonType];