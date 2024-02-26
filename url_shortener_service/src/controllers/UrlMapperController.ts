import { Request, Response } from 'express';
import KnexSingleton from '../database/knexSingleton';
import ParseUrlMapperItemsResponseHelper from '../helpers/parseUrlMapperItemsResponseHelper';
import RequestByBrowserRepository from '../repositories/requestByBrowserRepository';
import RequestByDeviceRepository from '../repositories/requestByDeviceRepository';
import RequestByMonthRepository from '../repositories/requestByMonthRepository';
import RequestByOperationalSystemRepository from '../repositories/requestByOperationalSystemRepository';
import RequestByWeekRepository from '../repositories/requestByWeekRepository';
import UrlMapperRepository from '../repositories/urlMapperRepository';

class UrlMapperController {
    private urlMapperRepository: UrlMapperRepository;
    private requestByWeekRepository: RequestByWeekRepository;
    private requestByMonthRepository: RequestByMonthRepository;
    private requestByDeviceRepository: RequestByDeviceRepository;
    private requestByOperationalSystemRepository: RequestByOperationalSystemRepository;
    private requestByBrowserRepository: RequestByBrowserRepository;

    constructor() {
        this.urlMapperRepository = new UrlMapperRepository(KnexSingleton);
        this.requestByWeekRepository = new RequestByWeekRepository(KnexSingleton);
        this.requestByMonthRepository = new RequestByMonthRepository(KnexSingleton);
        this.requestByDeviceRepository = new RequestByDeviceRepository(KnexSingleton);
        this.requestByOperationalSystemRepository = new RequestByOperationalSystemRepository(KnexSingleton);
        this.requestByBrowserRepository = new RequestByBrowserRepository(KnexSingleton);
    }

    public async getAllUrlMapper(req: Request, res: Response): Promise<Response> {
        try {
            const page: string = req.query.page?.toString() || '1';
            const pageSize: string = req.query.pageSize?.toString() || '10';
            const longUrlFilter: string = req.query.longUrlFilter?.toString() || '';
            const createdByFilter: string = req.query.createdByFilter?.toString() || '';

            const [
                urlMapperItemsDb,
                urlMapperCount
            ] = await Promise.all([
                this.urlMapperRepository.getAllUrlMapper(parseInt(page, 10), parseInt(pageSize, 10), longUrlFilter, createdByFilter),
                this.urlMapperRepository.countUrlMapperItems()
            ]);

            const urlMapperIds = urlMapperItemsDb.map((urlMapper) => urlMapper.id);

            const [
                requestInfoByWeek,
                requestInfoByMonth,
                requestInfoByOperationalSystem,
                requestInfoByDevices,
                requestInfoByBrowser
            ] = await Promise.all([
                this.requestByWeekRepository.getRequestByWeekByUrlMapperIds(urlMapperIds),
                this.requestByMonthRepository.getRequestByMonthByUrlMapperIds(urlMapperIds),
                this.requestByOperationalSystemRepository.getRequestByOperationalSystemByUrlMapperIds(urlMapperIds),
                this.requestByDeviceRepository.getRequestByDeviceByUrlMapperIds(urlMapperIds),
                this.requestByBrowserRepository.getRequestByBrowserByUrlMapperIds(urlMapperIds)
            ]);

            const urlMapperItems = ParseUrlMapperItemsResponseHelper.parseUrlMapperItems(
                urlMapperItemsDb,
                requestInfoByWeek,
                requestInfoByMonth,
                requestInfoByDevices,
                requestInfoByOperationalSystem,
                requestInfoByBrowser
            );

            return res.status(200).json({ urlMapperItems, maxItems: urlMapperCount });
        } catch (error) {
            console.error('Error trying to get urlMapper list:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async getUrlMapperById(req: Request, res: Response): Promise<Response> {
        try {
            const id: number = parseInt(req.params.id, 10);
            const [
                urlMapperItemDb,
                requestInfoByWeek,
                requestInfoByMonth,
                requestInfoByOperationalSystem,
                requestInfoByDevices,
                requestInfoByBrowser
            ] = await Promise.all([
                this.urlMapperRepository.getUrlMapperItemById(id),
                this.requestByWeekRepository.getRequestByWeekByUrlMapperId(id),
                this.requestByMonthRepository.getRequestByMonthByUrlMapperId(id),
                this.requestByOperationalSystemRepository.getRequestByOperationalSystemByUrlMapperId(id),
                this.requestByDeviceRepository.getRequestByDeviceByUrlMapperId(id),
                this.requestByBrowserRepository.getRequestByBrowserByUrlMapperId(id)
            ]);

            if (urlMapperItemDb) {
                const urlMapperItem = ParseUrlMapperItemsResponseHelper.parseUrlMapperItem(
                    urlMapperItemDb,
                    requestInfoByWeek,
                    requestInfoByMonth,
                    requestInfoByDevices,
                    requestInfoByOperationalSystem,
                    requestInfoByBrowser
                );

                return res.status(200).json(urlMapperItem);
            } else {
                return res.status(404).json({ message: 'UrlMapper Not found' });
            }
        } catch (error) {
            console.error('Error trying to get urlMapper:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default UrlMapperController;
