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

            googleId:document.googleId,

            avatar: document.avatar,

            authProvider:document.authProvider,

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

            googleId:user.googleId,

            avatar: user.avatar,

            authProvider:user.authProvider,

            role: user.role,

            status: user.status,

            isVerified: user.isVerified
        };
    }
}