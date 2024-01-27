import Knex from 'knex';
type Knex = typeof Knex

interface User {
    id: number;
    email: string;
    password: string;
}

class UserRepository {
    private knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async createUser(user: Partial<User>): Promise<User> {
        const [createdUser] = await this.knex('user').insert(user).returning('*');
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
