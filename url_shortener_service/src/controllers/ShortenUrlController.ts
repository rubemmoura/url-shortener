import crypto from 'crypto';
import { Request, Response } from 'express';
import KnexSingleton from '../database/knexSingleton';
import { AuthHelper } from '../helpers/authHelper';
import { UserAgentHelper } from '../helpers/userAgentHelper';
import RequestByBrowserRepository from '../repositories/requestByBrowserRepository';
import RequestByDeviceRepository from '../repositories/requestByDeviceRepository';
import RequestByMonthRepository from '../repositories/requestByMonthRepository';
import RequestByOperationalSystemRepository from '../repositories/requestByOperationalSystemRepository';
import RequestByWeekRepository from '../repositories/requestByWeekRepository';
import UrlMapperRepository from '../repositories/urlMapperRepository';

class ShortenUrlController {
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

    public async redirectToLongUrl(req: Request, res: Response): Promise<Response | void> {
        try {
            const hash: string = req.params.hash;
            const urlMapperItem = await this.urlMapperRepository.getUrlMapperItemByHash(hash)

            if (urlMapperItem) {
                const longUrl = urlMapperItem.longUrl.startsWith('http://') || urlMapperItem.longUrl.startsWith('https://') ? urlMapperItem.longUrl : `http://${urlMapperItem.longUrl}`;
                const { device, os, browser } = UserAgentHelper.parseUserAgent(req);

                await Promise.all([
                    this.urlMapperRepository.incrementCounterUrlMapperItemByHash(hash),
                    this.requestByWeekRepository.upsertRequestByWeek(urlMapperItem.id),
                    this.requestByMonthRepository.upsertRequestByMonth(urlMapperItem.id),
                    this.requestByDeviceRepository.upsertRequestByDevice(urlMapperItem.id, device),
                    this.requestByOperationalSystemRepository.upsertRequestByOperationalSystem(urlMapperItem.id, os),
                    this.requestByBrowserRepository.upsertRequestByBrowser(urlMapperItem.id, browser),
                ]);

                return res.redirect(301, longUrl);
            } else {
                return res.status(404).send('URL not found');
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async shortenUrl(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization;
            const longUrl: string = req.body.url;
            let shortUrl = '';
            let userEmail = await AuthHelper.getUserEmail(token);

            const urlMapperItemDb = await this.urlMapperRepository.getUrlMapperItemByLongUrl(longUrl)
            if (urlMapperItemDb) {
                shortUrl = `http://localhost:3001/${urlMapperItemDb.hash}`;
                return res.status(201).json({ message: 'Short URL created', shortUrl, hash: urlMapperItemDb.hash });
            }

            let hash = crypto.createHash('sha256').update(longUrl).digest('hex').substring(0, 8);
            let existingItem = await this.urlMapperRepository.getUrlMapperItemByHash(hash);

            // Continue generating new hashes until we find one that doesn't exist
            while (existingItem) {
                hash = crypto.createHash('sha256').update(longUrl + Math.random()).digest('hex').substring(0, 8);
                existingItem = await this.urlMapperRepository.getUrlMapperItemByHash(hash);
            }

            const currentDate = new Date().toISOString();

            const urlMapperItem = await this.urlMapperRepository.createUrlMapperItem({
                longUrl,
                hash,
                createdBy: userEmail,
                createdAt: currentDate
            });

            shortUrl = `http://localhost:3001/${urlMapperItem.hash}`;

            return res.status(201).json({ message: 'Short URL created', shortUrl, hash });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default ShortenUrlController;
