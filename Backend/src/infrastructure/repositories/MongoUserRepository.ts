import { IUserRepository } from "../../domain/repositories/IUserRepository";

import { User } from "../../domain/entities/User";

import { UserModel } from "../database/models/UserModel";

import { UserMapper } from "../mappers/UserMapper";


export class MongoUserRepository implements IUserRepository {
    async create(user: User): Promise<User> {

        const document =
            await UserModel.create(
                UserMapper.toPersistence(user)
            );

        return UserMapper.toDomain(document);
    }

    async findById(id: string): Promise<User | null> {

        const document = await UserModel.findById(id);

        if (!document) {
            return null;
        }

        return UserMapper.toDomain(document);
    }


    async findByEmail(email: string): Promise<User | null> {

        const document = await UserModel.findOne({ email: email.toLowerCase() });

        if (!document) {
            return null;
        }

        return UserMapper.toDomain(document);
    }

    async update(user: User): Promise<User> {
        const document =
            await UserModel.findByIdAndUpdate(
                user.id,
                UserMapper.toPersistence(user),
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

        return UserMapper.toDomain(document);
    }

    async existsByEmail(email: string): Promise<boolean> {
        const exists = await UserModel.exists({
            email: email.toLowerCase()
        });

        return exists !== null;
    }

}