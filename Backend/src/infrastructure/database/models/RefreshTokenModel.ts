import { Document, Model, Schema, model,Types } from "mongoose";



export interface IRefreshTokenDocument extends Document {
    userId: Types.ObjectId;
    tokenHash: string,
    expiresAt: Date;
    revokedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}



const refreshTokenScema = new Schema<IRefreshTokenDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        },

        revokedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);



export const RefreshTokenModel:Model<IRefreshTokenDocument>=model<IRefreshTokenDocument>(
    "RefreshToken",
    refreshTokenScema
);