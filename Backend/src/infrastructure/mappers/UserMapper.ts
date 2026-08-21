import { User } from "../../domain/entities/User";
import { IUserDocument } from "../database/models/UserModel";

export class UserMapper {

    static toDomain(
        document: IUserDocument
    ): User {

        return new User({
            id: document._id.toString(),

            firstName: document.firstName,

            lastName: document.lastName,

            email: document.email,

            password: document.password,

            avatar: document.avatar,

            role: document.role,

            status: document.status,

            isVerified: document.isVerified,

            createdAt: document.createdAt,

            updatedAt: document.updatedAt
        });
    }

    static toPersistence(
        user: User
    ) {
        return {
            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            password: user.password,

            avatar: user.avatar,

            role: user.role,

            status: user.status,

            isVerified: user.isVerified
        };
    }
}