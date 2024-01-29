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

    async getUrlMapperItemById(id: number): Promise<UrlMapperItem> {
        const urlMapperItem = await this.knex('urlMapper').where({ id }).first();
        return urlMapperItem;
    }

    async getAllUrlMapper(
        pageNumber: number = 1,
        pageSize: number = 10,
        longUrlFilter: string = '',
        createdByFilter: string = ''
    ): Promise<UrlMapperItem[]> {
        const offset = (pageNumber - 1) * pageSize;

        let query = this.knex('urlMapper')
            .where('longUrl', 'like', `%${longUrlFilter}%`)
            .where('createdBy', 'like', `%${createdByFilter}%`)
            .limit(pageSize)
            .offset(offset);

        const urlMapperItems = await query;

        return urlMapperItems;
    }

    async countUrlMapperItems(): Promise<number> {
        const countQuery = await this.knex('urlMapper').count('* as totalCount').first();

        if (countQuery && typeof countQuery === 'object') {
            const totalCountString: string | undefined = countQuery.totalCount?.toString();
            const totalCount: number = totalCountString ? parseInt(totalCountString, 10) : 0;
            return isNaN(totalCount) ? 0 : totalCount;
        } else {
            return 0;
        }
    }

    async deleteUrlMapperItemById(id: number): Promise<void> {
        await this.knex('urlMapper').where({ id }).del();
    }

    async incrementCounterUrlMapperItemByHash(hash: string): Promise<void> {
        await this.knex('urlMapper').where({ hash }).increment('accessCount', 1);
    }
}

export default UrlMapperRepository;
