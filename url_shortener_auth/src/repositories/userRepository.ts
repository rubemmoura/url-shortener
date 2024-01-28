import bcrypt from 'bcrypt';
import KnexSingleton from '../database/knexSingleton';
import { User } from '../interfaces/user';

class UserRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createUser(user: User): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10); // 10 é o custo do hash, quanto maior, mais seguro, mas mais lento
        const userToInsert: User = {
            ...user,
            password: hashedPassword
        };

        const [createdUser] = await this.knex('user').insert(userToInsert).returning('*');
        return createdUser;
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const user = await this.knex('user').where({ email }).first();
        return user;
    }

    async deleteUserByEmail(email: string): Promise<void> {
        await this.knex('user').where({ email }).del();
    }
}

export default UserRepository;
