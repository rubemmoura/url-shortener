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

    async getRequestCountsByWeek(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select(this.knex.raw("DATE_TRUNC('week', \"createdAt\") AS week_start"))
            .count('* as request_count')
            .groupBy('urlMapper_id', 'week_start')
            .orderBy('urlMapper_id')
            .orderBy('week_start');

        return result;
    }

    async getRequestCountsByMonth(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select(this.knex.raw("DATE_TRUNC('month', \"createdAt\") AS month_start"))
            .count('* as request_count')
            .groupBy('urlMapper_id', 'month_start')
            .orderBy('urlMapper_id')
            .orderBy('month_start');

        return result;
    }
}

export default RequestRepository;
