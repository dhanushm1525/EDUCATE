import { Document, Schema, model } from "mongoose";
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { AuthProvider } from "../../../shared/enums/AuthProvider";

export interface IUserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    role: UserRole;
    authProvider: AuthProvider;
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
            minlength: 1,
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
            
        },

        googleId: {

            type: String,

            unique: true,

            sparse: true

        },


        authProvider: {

            type:
                String,

            enum:
                Object.values(
                    AuthProvider
                ),

            required:
                true,

            default:
                AuthProvider.LOCAL

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