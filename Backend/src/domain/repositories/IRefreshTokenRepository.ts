export interface IRefreshTokenRepository {
    create(
        userId: string,
        tokenHash: string,
        expiresAt: Date
    ): Promise<void>;

    findActiveByTokenHash(
        tokenHash: string,
    ): Promise<{
        id: string,
        userId: string,
        expiresAt: Date
    } | null>


    revokeById(
        id:string
    ):Promise<void>


    revokeAllByUserId(
        userId:string
    ):Promise<void>;
}




