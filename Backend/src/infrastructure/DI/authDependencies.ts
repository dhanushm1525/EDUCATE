import { RegisterUser } from "../../application/use-cases/auth/RegisterUser";

import { MongoUserRepository } from "../repositories/MongoUserRepository";

import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";


const userRepository = new MongoUserRepository();

const passwordHasher = new BcryptPasswordHasher();


export const registerUser =new RegisterUser(userRepository,passwordHasher);