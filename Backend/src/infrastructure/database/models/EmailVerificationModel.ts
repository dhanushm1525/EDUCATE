import { Document, Model,Schema,model,Types } from "mongoose";


export interface IEmailVerificationDocument extends Document{
    userId:Types.ObjectId;
    otpHash:string;
    expiresAt:Date;
    createdAt:Date;
    updatedAt:Date;
}




const emailVerificationSchema = new Schema<IEmailVerificationDocument>(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true
        },

        otpHash:{
            type:String,
            required:true
        },


        expiresAt:{
            type:Date,
            required:true,
            expires:0
        },


    },

    {
        timestamps:true
    }
);


export const EmailVerificationModel:Model<IEmailVerificationDocument>=model<IEmailVerificationDocument>(
    "EmailVerification",
    emailVerificationSchema
)