export interface EmailVerificationRecord{
    id:string;
    userId:string;
    otpHash:string;
    expiresAt:Date;
}

export interface IEmailVerificationRepository{
    create(
        userId:string,
        otpHash:string,
        expiresAt:Date
    ):Promise<void>;

    findByUserId(
        userId:string
    ):Promise<EmailVerificationRecord|null>

    deleteByUserId(
        userId:string
    ):Promise<void>;
}