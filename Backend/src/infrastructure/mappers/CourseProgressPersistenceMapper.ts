
import { CourseProgress } from "../../domain/entities/CourseProgress";
import { CourseProgressDocument } from "../database/models/CourseProgressModel";

export class CourseProgressPersistenceMapper {
    static toDomain(document: CourseProgressDocument): CourseProgress {
        return {
            progressId: document._id.toString(),

            enrollmentId: document.enrollmentId.toString(),
            userId: document.userId.toString(),
            courseId: document.courseId.toString(),

            completedLessons: (document.completedLessons ?? []).map(
                (lesson) => ({
                    lessonId: lesson.lessonId.toString(),
                    completedAt: lesson.completedAt,
                    watchPercentage: lesson.watchPercentage,
                })
            ),

            completedAssignments: (
                document.completedAssignments ?? []
            ).map((assignment) => ({
                assignmentId: assignment.assignmentId.toString(),
                submissionId: assignment.submissionId.toString(),
                completedAt: assignment.completedAt,
            })),

            videoProgress: (document.videoProgress ?? []).map((item) => ({
                lessonId: item.lessonId.toString(),
                watchPercentage: item.watchPercentage,
                updatedAt: item.updatedAt,
            })),

            lastAccessedLessonId:
                document.lastAccessedLessonId?.toString(),

            completedAt: document.completedAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }

    static toPersistence(progress: CourseProgress) {
        return {
            enrollmentId: progress.enrollmentId,
            userId: progress.userId,
            courseId: progress.courseId,

            completedLessons: progress.completedLessons,
            completedAssignments: progress.completedAssignments,
            videoProgress: progress.videoProgress,

            lastAccessedLessonId: progress.lastAccessedLessonId,
            completedAt: progress.completedAt,
        };
    }

    static toPersistenceUpdate(progress: Partial<CourseProgress>) {
        const {
            progressId: _progressId,
            enrollmentId: _enrollmentId,
            userId: _userId,
            courseId: _courseId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = progress;

        return updateData;
    }
}
