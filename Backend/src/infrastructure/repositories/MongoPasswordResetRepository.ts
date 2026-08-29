import { IPasswordResetRepository,PasswordResetRecord } from "../../domain/repositories/IPasswordResetRepository";
import { PasswordResetModel } from "../database/models/PasswordResetModel";


export class MongoPasswordResetRepository implements IPasswordResetRepository{
    async create(userId: string, otpHash: string, expiresAt: Date): Promise<void> {
        await PasswordResetModel.create({
            userId,
            otpHash,
            expiresAt
        });
    }


    async findByUserId(userId: string): Promise<PasswordResetRecord | null> {
        const passwordReset = await PasswordResetModel.findOne({
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
        await PasswordResetModel.deleteOne({
            userId
        })
    }



}