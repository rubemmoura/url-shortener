import KnexSingleton from '../database/knexSingleton';
import { RoleDb } from '../database/models/roleDb';
import { Role } from '../interfaces/role';

class RoleRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRole(role: Role): Promise<RoleDb> {
        const [createdRole] = await this.knex('role').insert(role).returning('*');
        return createdRole;
    }

    async getRoleByName(name: string): Promise<RoleDb> {
        const role = await this.knex('role').where({ name }).first();
        return role;
    }

    async getRoleById(id: number): Promise<RoleDb> {
        const role = await this.knex('role').where({ id }).first();
        return role;
    }

    async deleteRoleByName(name: string): Promise<void> {
        await this.knex('role').where({ name }).del();
    }
}

export default RoleRepository;
