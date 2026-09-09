import { IUserRepository } from "../../domain/repositories/IUserRepository";

import { User } from "../../domain/entities/User";

import { IUserDocument, UserModel } from "../database/models/UserModel";

import { UserMapper } from "../mappers/UserMapper";
import { BaseRepository } from "./BaseRepository";


export class MongoUserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(UserModel);
    }

    async create(user: User): Promise<User> {
        const document = await this.createDocument(
            UserMapper.toPersistence(user)
        );

        return UserMapper.toDomain(document);
    }

    async findById(id: string): Promise<User | null> {
        const document = await this.findByIdDocument(id);

        if (!document) {
            return null;
        }

        return UserMapper.toDomain(document);
    }


    async findByEmail(email: string): Promise<User | null> {
        const document = await this.findOneDocument({
            email: email.toLowerCase()
        });

        if (!document) {
            return null;
        }

        return UserMapper.toDomain(document);
    }

    async update(user: User): Promise<User> {
        if (!user.id) {
            throw new Error("User id is required to update");
        }

        const document = await this.updateByIdDocument(
            user.id,
            UserMapper.toPersistence(user)
        );

        if (!document) {
            throw new Error(
                "User could not be updated"
            );
        }

        return UserMapper.toDomain(document);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.existsDocument({
            email: email.toLowerCase()
        });
    }

}