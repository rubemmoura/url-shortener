import KnexSingleton from '../database/knexSingleton';
import { RequestByBrowserItemDb } from '../database/models/requestByBrowserItemDb';
import { RequestByBrowserItem } from '../interfaces/requestByBrowserItem';

class RequestByBrowserRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createRequestByBrowserItem(requestByBrowser: RequestByBrowserItem): Promise<RequestByBrowserItemDb> {
        const [createdRequestItem] = await this.knex('requestByBrowser').insert(requestByBrowser).returning('*');
        return createdRequestItem;
    }

    async getRequestByBrowserItemById(id: number): Promise<RequestByBrowserItemDb> {
        const requestItem = await this.knex('requestByBrowser').where({ id }).first();
        return requestItem;
    }

    async incrementCounterRequestBrowserItemById(id: number): Promise<RequestByBrowserItemDb> {
        const [updatedRequestItem] = await this.knex('requestByBrowser').where({ id }).increment('count', 1).returning('*');
        return updatedRequestItem;
    }

    async upsertRequestByBrowser(urlMapperId: number, browser: string): Promise<void> {
        await this.knex.raw(`
            INSERT INTO public."requestByBrowser" ("urlMapper_id", "browser", "count")
            VALUES (?, ?, 1)
            ON CONFLICT ("urlMapper_id", "browser")
            DO UPDATE SET "count" = "requestByBrowser"."count" + 1
        `, [urlMapperId, browser]);
    }

    async getRequestByBrowserByUrlMapperId(urlMapperId: number): Promise<RequestByBrowserItemDb[]> {
        const requestItems = await this.knex('requestByBrowser').where({ urlMapper_id: urlMapperId });
        return requestItems;
    }

    async getRequestByBrowserByUrlMapperIds(urlMapperIds: number[]): Promise<RequestByBrowserItemDb[]> {
        const requestItems = await this.knex('requestByBrowser').whereIn('urlMapper_id', urlMapperIds);
        return requestItems;
    }

    async deleteRequestByOperationalSystemItemById(id: number): Promise<void> {
        await this.knex('requestByBrowser').where({ id }).del();
    }
}

export default RequestByBrowserRepository;
