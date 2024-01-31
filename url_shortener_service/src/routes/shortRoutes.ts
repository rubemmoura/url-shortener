import express, { Request, Response } from 'express';
import crypto from 'crypto';
import KnexSingleton from '../database/knexSingleton';
import UrlMapperRepository from '../repositories/urlMapperRepository';
import RequestRepository from '../repositories/requestRepository';
import { UserAgentHelper } from '../helpers/userAgentHelper';
import { AuthHelper } from '../helpers/authHelper';
import { ShortenUrlValidator } from '../validators/shortenUrlValidator';

const router = express.Router();
const urlMapperRepository = new UrlMapperRepository(KnexSingleton);
const requestRepository = new RequestRepository(KnexSingleton);
const jwtSecret = process.env.JWT_SECRET || '';

router.get('/:hash', async (req: Request, res: Response) => {
    try {
        const hash: string = req.params.hash;
        const urlMapperItem = await urlMapperRepository.getUrlMapperItemByHash(hash)

        if (urlMapperItem) {
            const longUrl = urlMapperItem.longUrl.startsWith('http://') || urlMapperItem.longUrl.startsWith('https://') ? urlMapperItem.longUrl : `http://${urlMapperItem.longUrl}`;
            const { device, os, browser } = UserAgentHelper.parseUserAgent(req);

            await urlMapperRepository.incrementCounterUrlMapperItemByHash(hash)
            await requestRepository.createRequestItem({ city: "cidade", country: "canada", device, operationalSystem: os, urlMapper_id: urlMapperItem.id, browser })

            return res.redirect(301, longUrl);
        } else {
            return res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/shorten', ShortenUrlValidator.validate, async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const longUrl: string = req.body.url;
        let shortUrl = '';
        let userEmail = await AuthHelper.getUserEmail(token);

        const urlMapperItemDb = await urlMapperRepository.getUrlMapperItemByLongUrl(longUrl)
        if (urlMapperItemDb) {
            shortUrl = `http://localhost:3001/${urlMapperItemDb.hash}`;
            return res.status(201).json({ message: 'Short URL created', shortUrl, hash: urlMapperItemDb.hash });
        }

        const hash = crypto.createHash('sha256').update(longUrl).digest('hex').substring(0, 8);
        const currentDate = new Date().toISOString();

        const urlMapperItem = await urlMapperRepository.createUrlMapperItem({
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
});


export default router;
