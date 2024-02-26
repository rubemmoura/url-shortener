import KnexSingleton from '../database/knexSingleton';
import { RequestByDeviceItemDb } from '../database/models/requestByDeviceItemDb';
import { RequestByDeviceItem } from '../interfaces/requestByDeviceItem';

class RequestByDeviceRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestByDeviceItem(requestByDevice: RequestByDeviceItem): Promise<RequestByDeviceItemDb> {
        const [createdRequestItem] = await this.knex('requestByDevice').insert(requestByDevice).returning('*');
        return createdRequestItem;
    }

    async getRequestByDeviceItemById(id: number): Promise<RequestByDeviceItemDb> {
        const requestItem = await this.knex('requestByDevice').where({ id }).first();
        return requestItem;
    }

    async incrementCounterRequestByDeviceItemById(id: number): Promise<RequestByDeviceItemDb> {
        const [updatedRequestItem] = await this.knex('requestByDevice').where({ id }).increment('count', 1).returning('*');
        return updatedRequestItem;
    }

    async upsertRequestByDevice(urlMapperId: number, device: string): Promise<void> {
        await this.knex.raw(`
            INSERT INTO public."requestByDevice" ("urlMapper_id", "device", "count")
            VALUES (?, ?, 1)
            ON CONFLICT ("urlMapper_id", "device")
            DO UPDATE SET "count" = "requestByDevice"."count" + 1
        `, [urlMapperId, device]);
    }

    async getRequestByDeviceByUrlMapperId(urlMapperId: number): Promise<RequestByDeviceItemDb[]> {
        const requestItems = await this.knex('requestByDevice').where({ urlMapper_id: urlMapperId });
        return requestItems;
    }

    async getRequestByDeviceByUrlMapperIds(urlMapperIds: number[]): Promise<RequestByDeviceItemDb[]> {
        const requestItems = await this.knex('requestByDevice').whereIn('urlMapper_id', urlMapperIds);
        return requestItems;
    }

    async deleteRequestByDeviceItemById(id: number): Promise<void> {
        await this.knex('requestByDevice').where({ id }).del();
    }
}

export default RequestByDeviceRepository;
