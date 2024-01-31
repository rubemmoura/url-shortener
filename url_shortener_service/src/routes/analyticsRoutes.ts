import express, { Request, Response } from 'express';
import KnexSingleton from '../database/knexSingleton';
import UrlMapperRepository from '../repositories/urlMapperRepository';
import { UrlMapperValidator } from '../validators/urlMapperValidator';
import { UrlMapperIdValidator } from '../validators/urlMapperByIdValidator';
import RequestRepository from '../repositories/requestRepository';

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

        const urlMapperItems = await urlMapperRepository.getAllUrlMapper(parseInt(page, 10), parseInt(pageSize, 10), longUrlFilter, createdByFilter);
        const urlMapperCount = await urlMapperRepository.countUrlMapperItems();
        const requestInfoByWeek = await requestRepository.getRequestCountsByWeek();
        const requestInfoByMonth = await requestRepository.getRequestCountsByMonth();

        console.log(requestInfoByWeek)
        console.log(requestInfoByMonth)

        // TODO extrac this to a function
        urlMapperItems.forEach(urlMapper => {
            urlMapper.week_start = '';
            urlMapper.week_request_count = 0;
            const infoByWeek = requestInfoByWeek.find(item => item.urlMapper_id === urlMapper.id);
            if (infoByWeek) {
                urlMapper.week_start = infoByWeek.week_start;
                urlMapper.week_request_count = infoByWeek.request_count;
            }
        });

        urlMapperItems.forEach(urlMapper => {
            urlMapper.month_start = '';
            urlMapper.month_request_count = 0;
            const infoByMonth = requestInfoByMonth.find(item => item.urlMapper_id === urlMapper.id);
            if (infoByMonth) {
                urlMapper.month_start = infoByMonth.month_start;
                urlMapper.month_request_count = infoByMonth.request_count;
            }
        });

        return res.status(200).json({ urlMapperItems, maxItems: urlMapperCount });
    } catch (error) {
        console.error('Error trying to get urlMapper list:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/url/:id', UrlMapperIdValidator.validate, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const urlMapperItem = await urlMapperRepository.getUrlMapperItemById(id);

        return res.status(200).json(urlMapperItem);
    } catch (error) {
        console.error('Error trying to get urlMapper:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
