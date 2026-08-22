export interface IRefreshTokenRepository {
    create(
        userId: string,
        tokenHash: string,
        expiresAt: Date
    ): Promise<void>;

    findByTokenHash(
        tokenHash: string,
    ): Promise<{
        id: string,
        userId: string,
        expiresAt: Date
        revokedAt:Date | null
    } | null>


    revokeById(
        id:string
    ):Promise<void>


    revokeAllByUserId(
        userId:string
    ):Promise<void>;
}




