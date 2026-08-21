import { User } from "../../../domain/entities/User"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { IPasswordHasher } from "../../interfaces/IPasswordHasher"
import { AppError } from "../../../shared/errors/AppError"
import { RegisterUserDTO } from "../../dtos/auth/RegisterUserDTO"
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export interface RegisterUserResponse {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string
}


export class RegisterUser {
    constructor(private readonly userRepository: IUserRepository, private readonly passwordHasher: IPasswordHasher) { }

    async execute(request: RegisterUserDTO): Promise<RegisterUserResponse> {
        const email = request.email.trim().toLowerCase();

        const exists = await this.userRepository.existsByEmail(email);

        if (exists) {
            throw new AppError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS,409);
        }

        const hashedPassword = await this.passwordHasher.hash(request.password);

        const user = new User({
            firstName: request.firstName.trim(),
            lastName: request.lastName.trim(),
            email,
            password: hashedPassword,
            role: UserRole.STUDENT,
            status: UserStatus.ACTIVE,
            isVerified: false
        });

        const createdUser = await this.userRepository.create(user);

        return {
            id: createdUser.id!,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            role: createdUser.role
        };
    }
}