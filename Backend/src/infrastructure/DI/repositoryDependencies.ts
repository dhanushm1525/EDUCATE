import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoCourseRepository } from "../repositories/MongoCourseRepository";

export const userRepository = new MongoUserRepository();

export const courseRepository = new MongoCourseRepository();