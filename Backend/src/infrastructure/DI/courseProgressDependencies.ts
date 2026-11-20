import { RecordLessonAccessUseCase } from "../../application/use-cases/courseProgress/RecordLessonAccessUseCase";
import { CompleteLessonUseCase } from "../../application/use-cases/courseProgress/CompleteLessonUseCase";
import { GetMyCourseProgressUseCase } from "../../application/use-cases/courseProgress/GetMyCourseProgressUseCase";
import { SaveVideoProgressUseCase } from "../../application/use-cases/courseProgress/SaveVideoProgressUseCase";

import { RecordLessonAccessController } from "../../presentation/controllers/courseProgress/RecordLessonAccessController";
import { CompleteLessonController } from "../../presentation/controllers/courseProgress/CompleteLessonController";
import { GetMyCourseProgressController } from "../../presentation/controllers/courseProgress/GetMyCourseProgressController";
import { SaveVideoProgressController } from "../../presentation/controllers/courseProgress/SaveVideoProgressController";

import {
    courseProgressRepository,
    enrollmentRepository,
    courseRepository,
    chapterRepository,
    lessonRepository,
} from "./repositoryDependencies";

const recordLessonAccessUseCase = new RecordLessonAccessUseCase(
    courseProgressRepository,
    enrollmentRepository,
    chapterRepository,
    lessonRepository
);

const completeLessonUseCase = new CompleteLessonUseCase(
    courseProgressRepository,
    enrollmentRepository,
    chapterRepository,
    lessonRepository
);

const getMyCourseProgressUseCase = new GetMyCourseProgressUseCase(
    courseProgressRepository,
    enrollmentRepository,
    courseRepository,
    chapterRepository,
    lessonRepository
);

const saveVideoProgressUseCase = new SaveVideoProgressUseCase(
    courseProgressRepository,
    enrollmentRepository,
    chapterRepository,
    lessonRepository
);

export const courseProgressControllers = {
    recordAccess: new RecordLessonAccessController(recordLessonAccessUseCase),
    completeLesson: new CompleteLessonController(completeLessonUseCase),
    getMine: new GetMyCourseProgressController(getMyCourseProgressUseCase),
    saveVideoProgress: new SaveVideoProgressController(saveVideoProgressUseCase),
};