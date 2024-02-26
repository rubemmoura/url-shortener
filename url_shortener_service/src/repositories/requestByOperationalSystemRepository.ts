import KnexSingleton from '../database/knexSingleton';
import { RequestByOperationalSystemItemDb } from '../database/models/requestByOperationalSystemItemDb';
import { RequestByOperationalSystemItem } from '../interfaces/requestByOperationalSystemItem';

class RequestByOperationalSystemRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestByOperationalSystemItem(requestByOperationalSystem: RequestByOperationalSystemItem): Promise<RequestByOperationalSystemItemDb> {
        const [createdRequestItem] = await this.knex('requestByOperationalSystem').insert(requestByOperationalSystem).returning('*');
        return createdRequestItem;
    }

    async getRequestByOperationalSystemItemById(id: number): Promise<RequestByOperationalSystemItemDb> {
        const requestItem = await this.knex('requestByOperationalSystem').where({ id }).first();
        return requestItem;
    }

    async incrementCounterRequestByOperationalSystemItemById(id: number): Promise<RequestByOperationalSystemItemDb> {
        const [updatedRequestItem] = await this.knex('requestByOperationalSystem').where({ id }).increment('count', 1).returning('*');
        return updatedRequestItem;
    }

    async upsertRequestByOperationalSystem(urlMapperId: number, operationalSystem: string): Promise<void> {
        await this.knex.raw(`
            INSERT INTO public."requestByOperationalSystem" ("urlMapper_id", "operationalSystem", "count")
            VALUES (?, ?, 1)
            ON CONFLICT ("urlMapper_id", "operationalSystem")
            DO UPDATE SET "count" = "requestByOperationalSystem"."count" + 1
        `, [urlMapperId, operationalSystem]);
    }

    async getRequestByOperationalSystemByUrlMapperId(urlMapperId: number): Promise<RequestByOperationalSystemItemDb[]> {
        const requestItems = await this.knex('requestByOperationalSystem').where({ urlMapper_id: urlMapperId });
        return requestItems;
    }

    async getRequestByOperationalSystemByUrlMapperIds(urlMapperIds: number[]): Promise<RequestByOperationalSystemItemDb[]> {
        const requestItems = await this.knex('requestByOperationalSystem').whereIn('urlMapper_id', urlMapperIds);
        return requestItems;
    }

    async deleteRequestByOperationalSystemItemById(id: number): Promise<void> {
        await this.knex('requestByOperationalSystem').where({ id }).del();
    }
}

export default RequestByOperationalSystemRepository;
