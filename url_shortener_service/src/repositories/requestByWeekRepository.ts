import moment from 'moment';
import KnexSingleton from '../database/knexSingleton';
import { RequestByWeekItemDb } from '../database/models/requestByWeekItemDb';
import { RequestByWeekItem } from '../interfaces/requestByWeekItem';

class RequestByWeekRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestByWeekItem(requestByWeek: RequestByWeekItem): Promise<RequestByWeekItemDb> {
        const [createdRequestItem] = await this.knex('requestByWeek').insert(requestByWeek).returning('*');
        return createdRequestItem;
    }

    async getRequestByWeekItemById(id: number): Promise<RequestByWeekItemDb> {
        const requestItem = await this.knex('requestByWeek').where({ id }).first();
        return requestItem;
    }

    async incrementCounterRequestByWeekItemById(id: number): Promise<RequestByWeekItemDb> {
        const [updatedRequestItem] = await this.knex('requestByWeek').where({ id }).increment('count', 1).returning('*');
        return updatedRequestItem;
    }

    async upsertRequestByWeek(urlMapperId: number): Promise<void> {
        const weekStartDate = moment().startOf('week').format();

        await this.knex.raw(`
            INSERT INTO public."requestByWeek" ("urlMapper_id", "weekStartDate", "count")
            VALUES (?, ?, 1)
            ON CONFLICT ("urlMapper_id", "weekStartDate")
            DO UPDATE SET "count" = "requestByWeek"."count" + 1
        `, [urlMapperId, weekStartDate]);
    }

    async getRequestByWeekByUrlMapperId(urlMapperId: number): Promise<RequestByWeekItemDb[]> {
        const requestItems = await this.knex('requestByWeek').where({ urlMapper_id: urlMapperId });
        return requestItems;
    }

    async getRequestByWeekByUrlMapperIds(urlMapperIds: number[]): Promise<RequestByWeekItemDb[]> {
        const requestItems = await this.knex('requestByWeek').whereIn('urlMapper_id', urlMapperIds);
        return requestItems;
    }

    async deleteRequestByWeekItemById(id: number): Promise<void> {
        await this.knex('requestByWeek').where({ id }).del();
    }
}

export default RequestByWeekRepository;
