export type UserRole = "student" | "teacher" | "admin";

export type UserStatus = "active" | "blocked" | "pending";

export interface UserProps {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
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
    private readonly _password: string;
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
        this._avatar = props.avatar;
        this._role = props.role;
        this._status = props.status;
        this._isVerified = props.isVerified;
        this._createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? new Date();
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

    get password(): string {
        return this._password;
    }

    get avatar(): string | undefined {
        return this._avatar;
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