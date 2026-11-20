import { MongoUserRepository } from "../repositories/MongoUserRepository";

import { MongoCourseRepository } from "../repositories/MongoCourseRepository";

import { MongoCategoryRepository } from "../repositories/MongoCategoryRepository";

import { MongoChapterRepository } from "../repositories/MongoChapterRepository";

import { MongoLessonRepository } from "../repositories/MongoLessonRepository";

import { MongoTeacherApplicationRepository }
    from "../repositories/MongoTeacherApplicationRepository";

import { MongoEnrollmentRepository } from "../repositories/MongoEnrollmentRepository";

import { MongoAssignmentSubmissionRepository } from "../repositories/MongoAssignmentSubmissionRepository";

import { MongoCourseProgressRepository } from "../repositories/MongoCourseProgressRepository";
import { MongoAssignmentRepository } from "../repositories/MongoAssignmentRepository";


export const userRepository = new MongoUserRepository();

export const courseRepository = new MongoCourseRepository();

export const categoryRepository = new MongoCategoryRepository();

export const chapterRepository = new MongoChapterRepository();

export const lessonRepository = new MongoLessonRepository();

export const teacherApplicationRepository = new MongoTeacherApplicationRepository();

export const enrollmentRepository = new MongoEnrollmentRepository();

export const assignmentSubmissionRepository =
    new MongoAssignmentSubmissionRepository();


export const courseProgressRepository = new MongoCourseProgressRepository();

export const assignmentRepository = new MongoAssignmentRepository();