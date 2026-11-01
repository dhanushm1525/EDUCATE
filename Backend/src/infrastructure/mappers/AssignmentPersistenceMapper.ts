
import {
    Assignment,
    AssignmentQuestion,
} from "../../domain/entities/Assingment";

import {
    AssignmentDocument,
    AssignmentQuestionDocument,
} from "../database/models/AssignmentModel";

import { randomUUID } from "crypto";

export class AssignmentPersistenceMapper {

    static toPersistence(assignment: Assignment) {

        return {
            lessonId: assignment.lessonId,

            title: assignment.title,
            description: assignment.description,

            questions: assignment.questions.map(
                (question) => ({
                    questionId: question.questionId ?? randomUUID(),
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    marks: question.marks,
                })
            ),

            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,

            timeLimit: assignment.timeLimit,
            attemptsAllowed: assignment.attemptsAllowed,

            dueDate: assignment.dueDate ?? null,
        };
    }

    static toDomain(
        document: AssignmentDocument
    ): Assignment {

        return {
            assignmentId: document._id.toString(),

            lessonId: document.lessonId.toString(),

            title: document.title,
            description: document.description,

            questions: document.questions.map(
                (question: AssignmentQuestionDocument): AssignmentQuestion => ({
                    questionId: question.questionId,
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    marks: question.marks,
                })
            ),

            totalMarks: document.totalMarks,
            passingMarks: document.passingMarks,

            timeLimit: document.timeLimit,
            attemptsAllowed: document.attemptsAllowed,

            dueDate: document.dueDate ?? null,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }

    static toPersistenceUpdate(
        assignment: Partial<Assignment>
    ) {

        return {
            ...(assignment.lessonId !== undefined && {
                lessonId: assignment.lessonId,
            }),

            ...(assignment.title !== undefined && {
                title: assignment.title,
            }),

            ...(assignment.description !== undefined && {
                description: assignment.description,
            }),

            ...(assignment.questions !== undefined && {
                questions: assignment.questions,
            }),

            ...(assignment.totalMarks !== undefined && {
                totalMarks: assignment.totalMarks,
            }),

            ...(assignment.passingMarks !== undefined && {
                passingMarks: assignment.passingMarks,
            }),

            ...(assignment.timeLimit !== undefined && {
                timeLimit: assignment.timeLimit,
            }),

            ...(assignment.attemptsAllowed !== undefined && {
                attemptsAllowed: assignment.attemptsAllowed,
            }),

            ...(assignment.dueDate !== undefined && {
                dueDate: assignment.dueDate,
            }),
        };
    }
}
