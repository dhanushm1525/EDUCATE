import { Types } from "mongoose";
import { IEmailVerificationRepository,EmailVerificationRecord } from "../../domain/repositories/IEmailVerificationRepository";
import { EmailVerificationModel } from "../database/models/EmailVerificationModel";




export class MongoEmailVerificationRepository implements IEmailVerificationRepository{

    async create(userId: string, otpHash: string, expiresAt: Date): Promise<void> {
        await EmailVerificationModel.create({
            userId:new Types.ObjectId(userId),
            otpHash,
            expiresAt
        });
    }


    async findByUserId(userId: string): Promise<EmailVerificationRecord | null> {
        const document = await EmailVerificationModel.findOne({userId:new Types.ObjectId(userId)});

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
        await EmailVerificationModel.deleteOne({
            userId:new Types.ObjectId(userId)
        });
    }
}