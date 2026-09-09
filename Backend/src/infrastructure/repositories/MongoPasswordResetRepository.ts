import { IPasswordResetRepository,PasswordResetRecord } from "../../domain/repositories/IPasswordResetRepository";
import { PasswordResetModel } from "../database/models/PasswordResetModel";
import { BaseRepository } from "./BaseRepository";
import { IPasswordResetDocument } from "../database/models/PasswordResetModel";


export class MongoPasswordResetRepository extends BaseRepository<IPasswordResetDocument> implements IPasswordResetRepository{
    constructor() {
        super(PasswordResetModel);
    }

    async create(userId: string, otpHash: string, expiresAt: Date): Promise<void> {
        await this.createDocument({
            userId,
            otpHash,
            expiresAt
        });
    }


    async findByUserId(userId: string): Promise<PasswordResetRecord | null> {
        const passwordReset = await this.findOneDocument({
            userId
        })

        if(!passwordReset){
            return null;
        }


        return{
            id:passwordReset._id.toString(),
            userId:passwordReset.userId.toString(),
            otpHash:passwordReset.otpHash,
            expiresAt:passwordReset.expiresAt
        };
    }


    async deleteByUserId(userId: string): Promise<void> {
        await this.deleteManyDocuments({
            userId
        })
    }



}