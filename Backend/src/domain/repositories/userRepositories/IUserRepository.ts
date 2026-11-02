
import { User } from "../../entities/User";

export interface IUserRepository {

    create(user: User): Promise<User>;

    findById(id: string): Promise<User | null>;

    findByIds(ids: string[]): Promise<User[]>;

    findByEmail(email: string): Promise<User | null>;

    update(user: User): Promise<User>;

    existsByEmail(email: string): Promise<boolean>;
}
