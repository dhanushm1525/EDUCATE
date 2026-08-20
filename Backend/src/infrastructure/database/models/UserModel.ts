import { Document, Schema, model } from "mongoose";

export interface IUserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar?: string;
    role: "student" | "teacher" | "admin";
    status: "active" | "blocked" | "pending";
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
            enum: [
                "student",
                "teacher",
                "admin"
            ],
            default: "student"
        },

        status: {
            type: String,
            enum: [
                "active",
                "blocked",
                "pending"
            ],
            default: "active"
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

export const UserModel = model<IUserDocument>("User",userSchema);