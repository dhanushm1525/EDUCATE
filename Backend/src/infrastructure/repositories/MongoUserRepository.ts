import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { IUserDocument, UserModel } from "../database/models/UserModel";


export class MongoUserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        const document = await UserModel.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified
        });

        return this.toDomain(document)
    }

    async findById(id: string): Promise<User | null> {
        const document = await UserModel.findById(id);

        if (!document) {
            return null
        }

        return this.toDomain(document)
    }


    async findByEmail(email: string): Promise<User | null> {

        const document =
            await UserModel.findOne({
                email: email.toLowerCase()
            });

        if (!document) {
            return null;
        }

        return this.toDomain(document);
    }

    async update(user: User): Promise<User> {
        const document =
            await UserModel.findByIdAndUpdate(
                user.id,
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    avatar: user.avatar,
                    role: user.role,
                    status: user.status,
                    isVerified: user.isVerified
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!document) {
            throw new Error(
                "User could not be updated"
            );
        }

        return this.toDomain(document);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const exists = await UserModel.exists({
            email: email.toLowerCase()
        });

        return exists !== null;
    }

    private toDomain(document: IUserDocument): User {
        return new User({
            id: document._id.toString(),

            firstName:
                document.firstName,

            lastName:
                document.lastName,

            email:
                document.email,

            password:
                document.password,

            avatar:
                document.avatar,

            role:
                document.role,

            status:
                document.status,

            isVerified:
                document.isVerified,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt
        })
    }

}