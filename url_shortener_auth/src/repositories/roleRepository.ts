import KnexSingleton from '../database/knexSingleton';
import { Role } from '../interfaces/role';

class RoleRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRole(role: Role): Promise<Role> {
        const [createdRole] = await this.knex('role').insert(role).returning('*');
        return createdRole;
    }

    async getRoleByName(name: string): Promise<Role> {
        const role = await this.knex('role').where({ name }).first();
        return role;
    }

    async getRoleById(id: number): Promise<Role> {
        const role = await this.knex('role').where({ id }).first();
        return role;
    }

    async deleteRoleByName(name: string): Promise<void> {
        await this.knex('role').where({ name }).del();
    }
}

export default RoleRepository;
