import { Request, Response } from 'express';
import KnexSingleton from '../database/knexSingleton';
import ParseUrlMapperItemsResponseHelper from '../helpers/parseUrlMapperItemsResponseHelper';
import RequestRepository from '../repositories/requestRepository';
import UrlMapperRepository from '../repositories/urlMapperRepository';

class UrlMapperController {
    private urlMapperRepository: UrlMapperRepository;
    private requestRepository: RequestRepository;

    constructor() {
        this.urlMapperRepository = new UrlMapperRepository(KnexSingleton);
        this.requestRepository = new RequestRepository(KnexSingleton);
    }

    public async getAllUrlMapper(req: Request, res: Response): Promise<Response> {
        try {
            const page: string = req.query.page?.toString() || '1';
            const pageSize: string = req.query.pageSize?.toString() || '10';
            const longUrlFilter: string = req.query.longUrlFilter?.toString() || '';
            const createdByFilter: string = req.query.createdByFilter?.toString() || '';

            const [
                urlMapperItemsDb,
                urlMapperCount,
                requestInfoByWeek,
                requestInfoByMonth,
                requestInfoByOperationalSystem,
                requestInfoByDevices,
                requestInfoByBrowser
            ] = await Promise.all([
                this.urlMapperRepository.getAllUrlMapper(parseInt(page, 10), parseInt(pageSize, 10), longUrlFilter, createdByFilter),
                this.urlMapperRepository.countUrlMapperItems(),
                this.requestRepository.getRequestCountsByWeek(),
                this.requestRepository.getRequestCountsByMonth(),
                this.requestRepository.getRequestCountsByOperationalSystem(),
                this.requestRepository.getRequestCountsByDevices(),
                this.requestRepository.getRequestCountsByBrowser()
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
                this.requestRepository.getRequestCountsByWeekById(id),
                this.requestRepository.getRequestCountsByMonthById(id),
                this.requestRepository.getRequestCountsByOperationalSystemById(id),
                this.requestRepository.getRequestCountsByDevicesById(id),
                this.requestRepository.getRequestCountsByBrowserById(id)
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
