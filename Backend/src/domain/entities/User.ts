import { AuthProvider } from "../../shared/enums/AuthProvider";
import { UserRole } from "../../shared/enums/UserRole";

import { UserStatus } from "../../shared/enums/UserStatus";



export interface UserProps {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    googleId?: string;
    authProvider:AuthProvider;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


export class User {
    private readonly _id?: string;

    private readonly _firstName: string;
    private readonly _lastName: string;
    private readonly _email: string;
    private _password?: string;
    private _googleId?: string;
    private readonly _authProvider:AuthProvider;
    private readonly _avatar?: string;
    private _role: UserRole;
    private _status: UserStatus;
    private _isVerified: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(props: UserProps) {
        this._id = props.id;
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._email = props.email;
        this._password = props.password;
        this._googleId = props.googleId
        this._avatar = props.avatar;
        this._authProvider = props.authProvider
        this._role = props.role;
        this._status = props.status;
        this._isVerified = props.isVerified;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
    }

    verifyEmail(): void {
        this._isVerified = true;
        this._updatedAt = new Date()
    }

    linkGoogleAccount(
        googleId: string
    ): void {

        this._googleId =
            googleId;

        this._updatedAt =
            new Date();

    }

    changePassword(
        hashedPassword: string
    ): void {
        this._password = hashedPassword;
        this._updatedAt = new Date();
    }



    get id(): string | undefined {
        return this._id;
    }

    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get email(): string {
        return this._email;
    }

    get password(): string|undefined {
        return this._password;
    }

    get googleId():string|undefined{
        return this._googleId;
    }

    get avatar(): string | undefined {
        return this._avatar;
    }

    get authProvider():AuthProvider{
        return this._authProvider
    }

    get role(): UserRole {
        return this._role;
    }

    get status(): UserStatus {
        return this._status;
    }

    get isVerified(): boolean {
        return this._isVerified;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}