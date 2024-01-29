import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import KnexSingleton from '../database/knexSingleton';
import UrlMapperRepository from '../repositories/urlMapperRepository';

const router = express.Router();
const urlMapperRepository = new UrlMapperRepository(KnexSingleton);
const jwtSecret = process.env.JWT_SECRET || '';

router.get('/:hash', async (req: Request, res: Response) => {
    const hash: string = req.params.hash;
    const urlMapperItem = await urlMapperRepository.getUrlMapperItemByHash(hash)

    if (urlMapperItem) {
        const longUrl = urlMapperItem.longUrl.startsWith('http://') || urlMapperItem.longUrl.startsWith('https://') ? urlMapperItem.longUrl : `http://${urlMapperItem.longUrl}`;

        await urlMapperRepository.incrementCounterUrlMapperItemByHash(hash)

        return res.redirect(301, longUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

router.post('/shorten', async (req: Request, res: Response) => {
    try {
        const longUrl: string = req.body.url;
        let shortUrl = '';
        let userEmail = '';

        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token is required' });
        }

        const verifyTokenAuth = 'http://host.docker.internal:3000/auth/verify-token';
        try {
            const verifyTokenResponse = await axios.post(verifyTokenAuth, { token });

            if (verifyTokenResponse.status !== 200) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            userEmail = verifyTokenResponse.data.decoded.email
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        if (!longUrl) {
            return res.status(400).json({ message: 'URL is required' });
        }

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
