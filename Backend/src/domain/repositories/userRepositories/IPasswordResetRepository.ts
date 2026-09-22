export interface PasswordResetRecord{
    id:string;
    userId:string;
    otpHash:string;
    expiresAt:Date;
}


export interface IPasswordResetRepository{

    create(
        userId:string,
        otpHash:string,
        expiresAt:Date
    ):Promise<void>


    findByUserId(
        userId:string
    ):Promise<PasswordResetRecord|null>


    deleteByUserId(
        userId:string
    ):Promise<void>
}