import { Assignment } from "../../domain/entities/Assingment";
import { Chapter } from "../../domain/entities/Chapter";
import { Course } from "../../domain/entities/Course";
import { Lesson } from "../../domain/entities/Lesson";
import { TeacherAssignmentDTO } from "../dtos/assingment/TeacherAssignmentDTO";

export class TeacherAssignmentMapper {
    static toDTO(
        assignment: Assignment,
        course: Course,
        chapter: Chapter,
        lesson: Lesson,
        totalSubmissions: number,
        gradedSubmissions: number
    ): TeacherAssignmentDTO {
        if (
            !assignment.assignmentId ||
            !course.courseId ||
            !chapter.chapterId ||
            !lesson.lessonId
        ) {
            throw new Error(
                "Cannot map an assignment with missing resource IDs"
            );
        }

        return {
            assignmentId: assignment.assignmentId,
            title: assignment.title,
            description: assignment.description,
            courseId: course.courseId,
            courseTitle: course.title,
            chapterId: chapter.chapterId,
            chapterTitle: chapter.title,
            lessonId: lesson.lessonId,
            lessonTitle: lesson.title,
            totalQuestions: assignment.questions.length,
            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,
            timeLimit: assignment.timeLimit,
            attemptsAllowed: assignment.attemptsAllowed,
            dueDate: assignment.dueDate,
            totalSubmissions,
            gradedSubmissions,
            pendingSubmissions: totalSubmissions - gradedSubmissions,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
        };
    }
}
