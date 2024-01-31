import KnexSingleton from '../database/knexSingleton';
import { RequestItemDb } from '../database/models/requestItemDb';
import { RequestItem } from '../interfaces/requestItem';

class RequestRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestItem(request: RequestItem): Promise<RequestItemDb> {
        const [createdRequestItem] = await this.knex('request').insert(request).returning('*');
        return createdRequestItem;
    }

    async getRequestItemById(id: number): Promise<RequestItemDb> {
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
            .count('* as register_count')
            .groupBy('urlMapper_id', 'week_start')
            .orderBy('urlMapper_id')
            .orderBy('week_start');

        return result;
    }

    async getRequestCountsByMonth(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select(this.knex.raw("DATE_TRUNC('month', \"createdAt\") AS month_start"))
            .count('* as register_count')
            .groupBy('urlMapper_id', 'month_start')
            .orderBy('urlMapper_id')
            .orderBy('month_start');

        return result;
    }

    async getRequestCountsByOperationalSystem(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('operationalSystem')
            .count('* as register_count')
            .groupBy('urlMapper_id', 'operationalSystem')
            .orderBy('urlMapper_id')
            .orderBy('operationalSystem');

        return result;
    }

    async getRequestCountsByDevices(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('device')
            .count('* as register_count')
            .groupBy('urlMapper_id', 'device')
            .orderBy('urlMapper_id')
            .orderBy('device');

        return result;
    }

    async getRequestCountsByBrowser(): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('browser')
            .count('* as register_count')
            .groupBy('urlMapper_id', 'browser')
            .orderBy('urlMapper_id')
            .orderBy('browser');

        return result;
    }

    async getRequestCountsByWeekById(urlMapperId: number): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select(this.knex.raw("DATE_TRUNC('week', \"createdAt\") AS week_start"))
            .count('* as register_count')
            .where('urlMapper_id', urlMapperId)
            .groupBy('urlMapper_id', 'week_start')
            .orderBy('week_start');

        return result;
    }

    async getRequestCountsByMonthById(urlMapperId: number): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select(this.knex.raw("DATE_TRUNC('month', \"createdAt\") AS month_start"))
            .count('* as register_count')
            .where('urlMapper_id', urlMapperId)
            .groupBy('urlMapper_id', 'month_start')
            .orderBy('month_start');

        return result;
    }

    async getRequestCountsByOperationalSystemById(urlMapperId: number): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('operationalSystem')
            .count('* as register_count')
            .where('urlMapper_id', urlMapperId)
            .groupBy('urlMapper_id', 'operationalSystem')
            .orderBy('operationalSystem');

        return result;
    }

    async getRequestCountsByDevicesById(urlMapperId: number): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('device')
            .count('* as register_count')
            .where('urlMapper_id', urlMapperId)
            .groupBy('urlMapper_id', 'device')
            .orderBy('device');

        return result;
    }

    async getRequestCountsByBrowserById(urlMapperId: number): Promise<any[]> {
        const result = await this.knex('request')
            .select('urlMapper_id')
            .select('browser')
            .count('* as register_count')
            .where('urlMapper_id', urlMapperId)
            .groupBy('urlMapper_id', 'browser')
            .orderBy('browser');

        return result;
    }

}

export default RequestRepository;
