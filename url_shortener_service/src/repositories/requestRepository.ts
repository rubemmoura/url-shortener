import KnexSingleton from '../database/knexSingleton';
import { RequestItem } from '../interfaces/requestItem';

class RequestRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestItem(request: RequestItem): Promise<RequestItem> {
        const [createdRequestItem] = await this.knex('request').insert(request).returning('*');
        return createdRequestItem;
    }

    async getRequestItemById(id: number): Promise<RequestItem> {
        const requestItem = await this.knex('request').where({ id }).first();
        return requestItem;
    }

    async deleteRequestItemById(id: number): Promise<void> {
        await this.knex('request').where({ id }).del();
    }
}

export default RequestRepository;
