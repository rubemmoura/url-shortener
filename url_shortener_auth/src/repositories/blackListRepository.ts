import KnexSingleton from '../database/knexSingleton';
import { BlackListItemDb } from '../database/models/blackListItemDb';
import { BlackListItem } from '../interfaces/blackListItem';

class BlackListRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createBlackListItem(blackListItem: BlackListItem): Promise<BlackListItemDb> {
        const [createdBlackListItem] = await this.knex('blackList').insert(blackListItem).returning('*');
        return createdBlackListItem;
    }

    async getBlackListItemByToken(token: string): Promise<BlackListItemDb> {
        const blackListItem = await this.knex('blackList').where({ token }).first();
        return blackListItem;
    }

    async deleteBlackListItemById(id: number): Promise<void> {
        await this.knex('blackList').where({ id }).del();
    }
}

export default BlackListRepository;
