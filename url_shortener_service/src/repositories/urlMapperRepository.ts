import KnexSingleton from '../database/knexSingleton';
import { UrlMapperItem } from '../interfaces/urlMapperItem';

class UrlMapperRepository {
    private knex: typeof KnexSingleton;

    constructor(knex: typeof KnexSingleton) {
        this.knex = knex;
    }

    async createUrlMapperItem(urlMapper: UrlMapperItem): Promise<UrlMapperItem> {
        const [createdUrlMapperItem] = await this.knex('urlMapper').insert(urlMapper).returning('*');
        return createdUrlMapperItem;
    }

    async getUrlMapperItemByLongUrl(longUrl: string): Promise<UrlMapperItem> {
        const urlMapperItem = await this.knex('urlMapper').where({ longUrl }).first();
        return urlMapperItem;
    }

    async getUrlMapperItemByHash(hash: string): Promise<UrlMapperItem> {
        const urlMapperItem = await this.knex('urlMapper').where({ hash }).first();
        return urlMapperItem;
    }

    async deleteUrlMapperItemById(id: number): Promise<void> {
        await this.knex('urlMapper').where({ id }).del();
    }

    async incrementCounterUrlMapperItemByHash(hash: string): Promise<void> {
        await this.knex('urlMapper').where({ hash }).increment('accessCount', 1);
    }
}

export default UrlMapperRepository;
