import bcrypt from 'bcrypt';
import KnexSingleton from '../database/knexSingleton';
import { UserDb } from '../database/models/userDb';
import { User } from '../interfaces/user';

class UserRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createUser(user: User): Promise<UserDb> {
        // 10 is the cost of the hash, the higher, the more secure, but slower
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const userToInsert: User = {
            ...user,
            password: hashedPassword
        };

        const [createdUser] = await this.knex('user').insert(userToInsert).returning('*');
        return createdUser;
    }

    async getUserByEmail(email: string): Promise<UserDb | undefined> {
        const user = await this.knex('user').where({ email }).first();
        return user;
    }

    async deleteUserByEmail(email: string): Promise<void> {
        await this.knex('user').where({ email }).del();
    }
}

export default UserRepository;
