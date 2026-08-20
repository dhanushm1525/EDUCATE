import { User } from "../../../domain/entities/User"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { IPasswordHasher } from "../../interfaces/IPasswordHasher"
import { AppError } from "../../../shared/errors/AppError"


export interface RegisterUserRequest{
    firstName:string,
    lastName:string,
    email:string,
    password:string
}

export interface RegisterUserResponse{
    id:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}


export class RegisterUser{
    constructor(private readonly userRepository:IUserRepository,private readonly passwordHasher:IPasswordHasher){}

    async execute(request:RegisterUserRequest):Promise<RegisterUserResponse>{
        const email = request.email.trim().toLowerCase();

        const exists = await this.userRepository.existsByEmail(email);

        if(exists){
            throw new AppError("Email is already registered",409);
        }

        const hashedPassword = await this.passwordHasher.hash(request.password);

        const user = new User({firstName:request.firstName.trim(),
            lastName:request.lastName.trim(),
            email,
            password:hashedPassword,
            role:"student",
            status:"active",
            isVerified:false});

        const createdUser = await this.userRepository.create(user);
        
        return {
            id:createdUser.id!,
            firstName:createdUser.firstName,
            lastName:createdUser.lastName,
            email:createdUser.email,
            role:createdUser.role
        };
    }
}