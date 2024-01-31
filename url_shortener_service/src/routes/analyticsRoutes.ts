import express, { Request, Response } from 'express';
import KnexSingleton from '../database/knexSingleton';
import UrlMapperRepository from '../repositories/urlMapperRepository';
import { UrlMapperValidator } from '../validators/urlMapperValidator';
import { UrlMapperIdValidator } from '../validators/urlMapperByIdValidator';
import RequestRepository from '../repositories/requestRepository';
import ParseUrlMapperItemsResponseHelper from '../helpers/parseUrlMapperItemsResponseHelper'

const router = express.Router();
const urlMapperRepository = new UrlMapperRepository(KnexSingleton);
const requestRepository = new RequestRepository(KnexSingleton);
const jwtSecret = process.env.JWT_SECRET || '';

router.get('/url', UrlMapperValidator.validate, async (req: Request, res: Response) => {
    try {
        const page = req.query.page?.toString() || '1';
        const pageSize = req.query.pageSize?.toString() || '10';
        const longUrlFilter = req.query.longUrlFilter?.toString() || '';
        const createdByFilter = req.query.createdByFilter?.toString() || '';

        const [
            urlMapperItemsDb,
            urlMapperCount,
            requestInfoByWeek,
            requestInfoByMonth,
            requestInfoByOperationalSystem,
            requestInfoByDevices,
            requestInfoByBrowser
        ] = await Promise.all([
            urlMapperRepository.getAllUrlMapper(parseInt(page, 10), parseInt(pageSize, 10), longUrlFilter, createdByFilter),
            urlMapperRepository.countUrlMapperItems(),
            requestRepository.getRequestCountsByWeek(),
            requestRepository.getRequestCountsByMonth(),
            requestRepository.getRequestCountsByOperationalSystem(),
            requestRepository.getRequestCountsByDevices(),
            requestRepository.getRequestCountsByBrowser()
        ]);

        const urlMapperItems = ParseUrlMapperItemsResponseHelper.parseUrlMapperItems(
            urlMapperItemsDb,
            requestInfoByWeek,
            requestInfoByMonth,
            requestInfoByDevices,
            requestInfoByOperationalSystem,
            requestInfoByBrowser
        )

        return res.status(200).json({ urlMapperItems, maxItems: urlMapperCount });
    } catch (error) {
        console.error('Error trying to get urlMapper list:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/url/:id', UrlMapperIdValidator.validate, async (req: Request, res: Response) => {
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
            urlMapperRepository.getUrlMapperItemById(id),
            requestRepository.getRequestCountsByWeekById(id),
            requestRepository.getRequestCountsByMonthById(id),
            requestRepository.getRequestCountsByOperationalSystemById(id),
            requestRepository.getRequestCountsByDevicesById(id),
            requestRepository.getRequestCountsByBrowserById(id)
        ]);

        if (urlMapperItemDb) {
            const urlMapperItem = ParseUrlMapperItemsResponseHelper.parseUrlMapperItem(
                urlMapperItemDb,
                requestInfoByWeek,
                requestInfoByMonth,
                requestInfoByDevices,
                requestInfoByOperationalSystem,
                requestInfoByBrowser
            )
            
            return res.status(200).json(urlMapperItem);
        } else {
            return res.status(404).json({ message: 'UrlMapper Not found' });
        }


    } catch (error) {
        console.error('Error trying to get urlMapper:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
