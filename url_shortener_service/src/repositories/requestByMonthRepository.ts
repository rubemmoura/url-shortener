import moment from 'moment';
import KnexSingleton from '../database/knexSingleton';
import { RequestByMonthItemDb } from '../database/models/requestByMonthItemDb';
import { RequestByMonthItem } from '../interfaces/requestByMonthItem';

class RequestByMonthRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestByMonthItem(requestByMonth: RequestByMonthItem): Promise<RequestByMonthItemDb> {
        const [createdRequestItem] = await this.knex('requestByMonth').insert(requestByMonth).returning('*');
        return createdRequestItem;
    }

    async getRequestByMonthItemById(id: number): Promise<RequestByMonthItemDb> {
        const requestItem = await this.knex('requestByMonth').where({ id }).first();
        return requestItem;
    }

    async incrementCounterRequestByMonthItemById(id: number): Promise<RequestByMonthItemDb> {
        const [updatedRequestItem] = await this.knex('requestByMonth').where({ id }).increment('count', 1).returning('*');
        return updatedRequestItem;
    }

    async upsertRequestByMonth(urlMapperId: number): Promise<void> {
        const monthStartDate = moment().startOf('month').format();

        await this.knex.raw(`
            INSERT INTO public."requestByMonth" ("urlMapper_id", "monthStartDate", "count")
            VALUES (?, ?, 1)
            ON CONFLICT ("urlMapper_id", "monthStartDate")
            DO UPDATE SET "count" = "requestByMonth"."count" + 1
        `, [urlMapperId, monthStartDate]);
    }

    async getRequestByMonthByUrlMapperId(urlMapperId: number): Promise<RequestByMonthItemDb[]> {
        const requestItems = await this.knex('requestByMonth').where({ urlMapper_id: urlMapperId });
        return requestItems;
    }

    async getRequestByMonthByUrlMapperIds(urlMapperIds: number[]): Promise<RequestByMonthItemDb[]> {
        const requestItems = await this.knex('requestByMonth').whereIn('urlMapper_id', urlMapperIds);
        return requestItems;
    }

    async deleteRequestByMonthItemById(id: number): Promise<void> {
        await this.knex('requestByMonth').where({ id }).del();
    }
}

export default RequestByMonthRepository;
