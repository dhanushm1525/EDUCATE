import { Types } from "mongoose";
import { IEmailVerificationRepository,EmailVerificationRecord } from "../../domain/repositories/IEmailVerificationRepository";
import { EmailVerificationModel, IEmailVerificationDocument } from "../database/models/EmailVerificationModel";
import { BaseRepository } from "./BaseRepository";




export class MongoEmailVerificationRepository extends BaseRepository<IEmailVerificationDocument> implements IEmailVerificationRepository{
    constructor() {
        super(EmailVerificationModel);
    }

    async create(userId: string, otpHash: string, expiresAt: Date): Promise<void> {
        await  this.createDocument({
            userId:new Types.ObjectId(userId),
            otpHash,
            expiresAt
        });
    }


    async findByUserId(userId: string): Promise<EmailVerificationRecord | null> {
        const document = await this.findOneDocument({userId:new Types.ObjectId(userId)});

        if(!document){
            return null;
        }

        return {
            id:document._id.toString(),
            userId:document.userId.toString(),
            otpHash:document.otpHash,
            expiresAt:document.expiresAt
        };
    }


    async deleteByUserId(userId: string): Promise<void> {
        await this.deleteManyDocuments({
            userId:new Types.ObjectId(userId)
        });
    }
}