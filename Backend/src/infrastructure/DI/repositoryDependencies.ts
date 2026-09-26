import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoCourseRepository } from "../repositories/MongoCourseRepository";
import { MongoCategoryRepository } from "../repositories/MongoCategoryRepository";
import { MongoChapterRepository } from "../repositories/MongoChapterRepository";
import { MongoLessonRepository } from "../repositories/MongoLessonRepository";

export const userRepository = new MongoUserRepository();

export const courseRepository = new MongoCourseRepository();

export const categoryRepository = new MongoCategoryRepository();

export const chapterRepository = new MongoChapterRepository();

export const lessonRepository = new MongoLessonRepository();