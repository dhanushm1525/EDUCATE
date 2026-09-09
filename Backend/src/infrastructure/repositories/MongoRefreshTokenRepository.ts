import { IRefreshTokenRepository,RefreshTokenRecord } from "../../domain/repositories/IRefreshTokenRepository";
import { RefreshTokenModel } from "../database/models/RefreshTokenModel";
import { Types  } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IRefreshTokenDocument } from "../database/models/RefreshTokenModel";



export class MongoRefreshTokenRepository extends BaseRepository<IRefreshTokenDocument> implements IRefreshTokenRepository {
    constructor() {
        super(RefreshTokenModel);
    }

    async create(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
        await this.createDocument({
            userId:new Types.ObjectId(userId),
            tokenHash,
            expiresAt
        });
    }


   async findByTokenHash(tokenHash: string): Promise<RefreshTokenRecord |null> {

    const document = await this.findOneDocument({ tokenHash });


    if (!document) {
        return null;
    }


    return {
        id: document._id.toString(),
        userId: document.userId.toString(),
        expiresAt: document.expiresAt,
        revokedAt: document.revokedAt
    };
}


    async revokeById(id: string): Promise<void> {
        await this.updateByIdDocument(
            id, { revokedAt: new Date() }
        );
    }


    async revokeAllByUserId(userId: string): Promise<void> {
        await this.updateManyDocuments(
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