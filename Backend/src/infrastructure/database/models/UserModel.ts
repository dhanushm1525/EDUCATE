import { Document, Schema, model } from "mongoose";
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";

export interface IUserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<IUserDocument>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: true
        },

        avatar: {
            type: String
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true
        },

        status: {
            type: String,
            enum: Object.values(UserStatus),
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

export const UserModel = model<IUserDocument>("User", userSchema);