import { IRefreshTokenRepository } from "../../domain/repositories/IRefreshTokenRepository";
import { RefreshTokenModel } from "../database/models/RefreshTokenModel";
import { Types  } from "mongoose";


export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
    async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
        await RefreshTokenModel.create({
            userId:new Types.ObjectId(userId),
            tokenHash,
            expiresAt
        });
    }


    async findByTokenHash(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date; revokedAt:Date|null} | null> {
        const document = await RefreshTokenModel.findOne({
            tokenHash,
    });

        if (!document) {
            return null
        }

        return {
            id: document._id.toString(),
            userId: document.userId.toString(),
            expiresAt: document.expiresAt,
            revokedAt:document.revokedAt
        };
    }


    async revokeById(id: string): Promise<void> {
        await RefreshTokenModel.findByIdAndUpdate(
            id, { revokedAt: new Date() }
        );
    }


    async revokeAllByUserId(userId: string): Promise<void> {
        await RefreshTokenModel.updateMany(
            {
                userId:new Types.ObjectId(userId),
                revokedAt: null
            },
            {
                revokedAt: new Date()
            }
        );
    }
}