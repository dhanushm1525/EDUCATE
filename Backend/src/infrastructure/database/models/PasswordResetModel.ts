import { Document,Schema,Model,model,Types } from "mongoose";

export interface IPasswordResetDocument extends Document{

    userId:Types.ObjectId;
    otpHash:string;
    expiresAt:Date;


}


const passwordResetSchema = new Schema<IPasswordResetDocument>(
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
        }
    },
    {
        timestamps:true
    }
);




export const PasswordResetModel:Model<IPasswordResetDocument>=model<IPasswordResetDocument>(
    "PasswordReset",passwordResetSchema
)