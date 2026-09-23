import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoCourseRepository } from "../repositories/MongoCourseRepository";
import { MongoCategoryRepository } from "../repositories/MongoCategoryRepository";

export const userRepository = new MongoUserRepository();

export const courseRepository = new MongoCourseRepository();

export const categoryRepository = new MongoCategoryRepository();