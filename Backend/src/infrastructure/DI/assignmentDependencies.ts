
import { MongoAssignmentRepository } from "../repositories/MongoAssignmentRepository";

import { CreateAssignmentUseCase } from "../../application/use-cases/assingment/CreateAssignmentUseCase";
import { GetAssignmentUseCase } from "../../application/use-cases/assingment/GetAssignmentUseCase";
import { UpdateAssignmentUseCase } from "../../application/use-cases/assingment/UpdateAssignmentUseCase";
import { DeleteAssignmentUseCase } from "../../application/use-cases/assingment/DeleteAssignmentUseCase";
import { GetStudentAssignmentUseCase } from "../../application/use-cases/assingment/GetStudentAssignmentUseCase";
import { SubmitAssignmentUseCase } from "../../application/use-cases/assingment/SubmitAssignmentUseCase";

import { CreateAssignmentController } from "../../presentation/controllers/assingment/CreateAssignmentController";
import { GetAssignmentController } from "../../presentation/controllers/assingment/GetAssignmentController";
import { UpdateAssignmentController } from "../../presentation/controllers/assingment/UpdateAssignmentController";
import { DeleteAssignmentController } from "../../presentation/controllers/assingment/DeleteAssignmentController";
import { GetStudentAssignmentController } from "../../presentation/controllers/assingment/GetStudentAssignmentController";
import { SubmitAssignmentController } from "../../presentation/controllers/assingment/SubmitAssignmentController";

import { MongoObjectIdValidator } from "../services/MongoObjectIdValidator";

import { GetAssignmentResultsUseCase } from "../../application/use-cases/assingment/GetAssignmentResultsUseCase";

import { GetAssignmentResultsController } from "../../presentation/controllers/assingment/GetAssignmentResultsController";

import { GetTeacherAssignmentSubmissionsUseCase } from "../../application/use-cases/assingment/GetTeacherAssignmentSubmissionsUseCase";

import { GetTeacherAssignmentSubmissionsController } from "../../presentation/controllers/assingment/GetTeacherAssignmentSubmissionsController";

import { GetTeacherSubmissionDetailUseCase } from "../../application/use-cases/assingment/GetTeacherSubmissionDetailUseCase";

import { GetTeacherSubmissionDetailController } from "../../presentation/controllers/assingment/GetTeacherSubmissionDetailController";

import { GradeAssignmentSubmissionUseCase } from "../../application/use-cases/assingment/GradeAssignmentSubmissionUseCase";

import { GradeAssignmentSubmissionController } from "../../presentation/controllers/assingment/GradeAssignmentSubmissionController";


import { GetTeacherAssignmentsUseCase } from "../../application/use-cases/assingment/GetTeacherAssignmentsUseCase";
import { GetTeacherAssignmentsController } from "../../presentation/controllers/assingment/GetTeacherAssignmentsController";

import { GetAssignmentByLessonUseCase }
    from "../../application/use-cases/assingment/GetAssignmentByLessonUseCase";

import { GetAssignmentByLessonController }
    from "../../presentation/controllers/assingment/GetAssignmentByLessonController";


import {
    enrollmentRepository,
    assignmentSubmissionRepository,
    lessonRepository,
    courseRepository,
    chapterRepository,
    userRepository
} from "./repositoryDependencies";

import { StartAssignmentAttemptUseCase } from "../../application/use-cases/assingment/StartAssignmentAttemptUseCase";
import { StartAssignmentAttemptController } from "../../presentation/controllers/assingment/StartAssignmentAttemptController";


export const assignmentRepository =
    new MongoAssignmentRepository();


const identifierValidator = new MongoObjectIdValidator();


// ==============================
// USE CASES
// ==============================

const createAssignmentUseCase =
    new CreateAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const getAssignmentUseCase =
    new GetAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const updateAssignmentUseCase =
    new UpdateAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const deleteAssignmentUseCase =
    new DeleteAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );


const getStudentAssignmentUseCase =
    new GetStudentAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository,
        enrollmentRepository,
        assignmentSubmissionRepository
    );


const submitAssignmentUseCase =
    new SubmitAssignmentUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository,
        enrollmentRepository,
        assignmentSubmissionRepository
    );


const getAssignmentResultsUseCase =
    new GetAssignmentResultsUseCase(
        assignmentRepository,
        assignmentSubmissionRepository
    );

const getTeacherAssignmentSubmissionsUseCase =
    new GetTeacherAssignmentSubmissionsUseCase(
        assignmentRepository,
        assignmentSubmissionRepository,
        lessonRepository,
        chapterRepository,
        courseRepository,
        userRepository
    );

const getTeacherSubmissionDetailUseCase =
    new GetTeacherSubmissionDetailUseCase(
        assignmentRepository,
        assignmentSubmissionRepository,
        lessonRepository,
        chapterRepository,
        courseRepository,
        userRepository
    );

const gradeAssignmentSubmissionUseCase =
    new GradeAssignmentSubmissionUseCase(
        assignmentRepository,
        assignmentSubmissionRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );

const getTeacherAssignmentsUseCase =
    new GetTeacherAssignmentsUseCase(
        assignmentRepository,
        assignmentSubmissionRepository,
        courseRepository,
        chapterRepository,
        lessonRepository
    );

const getAssignmentByLessonUseCase =
    new GetAssignmentByLessonUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository
    );

    const startAssignmentAttemptUseCase =
    new StartAssignmentAttemptUseCase(
        assignmentRepository,
        lessonRepository,
        chapterRepository,
        courseRepository,
        enrollmentRepository,
        assignmentSubmissionRepository
    );

// ==============================
// CONTROLLERS
// ==============================

export const createAssignmentController =
    new CreateAssignmentController(
        createAssignmentUseCase,
        identifierValidator
    );


export const getAssignmentController =
    new GetAssignmentController(
        getAssignmentUseCase
    );


export const updateAssignmentController =
    new UpdateAssignmentController(
        updateAssignmentUseCase,
        identifierValidator
    );


export const deleteAssignmentController =
    new DeleteAssignmentController(
        deleteAssignmentUseCase,
        identifierValidator
    );


export const getStudentAssignmentController =
    new GetStudentAssignmentController(
        getStudentAssignmentUseCase,
        identifierValidator
    );


export const submitAssignmentController =
    new SubmitAssignmentController(
        submitAssignmentUseCase,
        identifierValidator
    );



export const getAssignmentResultsController =
    new GetAssignmentResultsController(
        getAssignmentResultsUseCase,
        identifierValidator
    );

export const getTeacherAssignmentSubmissionsController =
    new GetTeacherAssignmentSubmissionsController(
        getTeacherAssignmentSubmissionsUseCase,
        identifierValidator
    );

export const getTeacherSubmissionDetailController =
    new GetTeacherSubmissionDetailController(
        getTeacherSubmissionDetailUseCase,
        identifierValidator
    );



export const gradeAssignmentSubmissionController =
    new GradeAssignmentSubmissionController(
        gradeAssignmentSubmissionUseCase,
        identifierValidator
    );

export const getTeacherAssignmentsController =
    new GetTeacherAssignmentsController(
        getTeacherAssignmentsUseCase
    );


export const getAssignmentByLessonController =
    new GetAssignmentByLessonController(
        getAssignmentByLessonUseCase,
        identifierValidator
    );

    export const startAssignmentAttemptController =
    new StartAssignmentAttemptController(
        startAssignmentAttemptUseCase,
        identifierValidator
    );