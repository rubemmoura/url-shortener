import express, { Request, Response } from 'express';
import axios from 'axios';
import KnexSingleton from '../database/knexSingleton';
import UrlMapperRepository from '../repositories/urlMapperRepository';
import { User } from '../interfaces/user';

const router = express.Router();
const urlMapperRepository = new UrlMapperRepository(KnexSingleton);
const jwtSecret = process.env.JWT_SECRET || '';
const ADMIN = 'ADMIN';

router.get('/url', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const page = req.query.page?.toString() || '1';
        const pageSize = req.query.pageSize?.toString() || '10';
        const longUrlFilter = req.query.longUrlFilter?.toString() || '';
        const createdByFilter = req.query.createdByFilter?.toString() || '';

        let user: User;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token is required' });
        }

        const verifyTokenAuth = 'http://host.docker.internal:3000/auth/verify-token';
        try {
            const verifyTokenResponse = await axios.post(verifyTokenAuth, { token });

            if (verifyTokenResponse.status !== 200) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            user = verifyTokenResponse.data.decoded
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        if (user.role !== ADMIN) {
            return res.status(401).json({ message: 'Unauthorized: Invalid user role' });
        }

        const urlMapperItems = await urlMapperRepository.getAllUrlMapper(parseInt(page, 10), parseInt(pageSize, 10), longUrlFilter, createdByFilter);
        const urlMapperCount = await urlMapperRepository.countUrlMapperItems();

        return res.status(200).json({ urlMapperItems, maxItems: urlMapperCount });
    } catch (error) {
        console.error('Error trying to get urlMapper list:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/url/:id', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const id: number = parseInt(req.params.id, 10);
        let user: User;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token is required' });
        }

        const verifyTokenAuth = 'http://host.docker.internal:3000/auth/verify-token';
        try {
            const verifyTokenResponse = await axios.post(verifyTokenAuth, { token });

            if (verifyTokenResponse.status !== 200) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            user = verifyTokenResponse.data.decoded
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        if (user.role !== ADMIN) {
            return res.status(401).json({ message: 'Unauthorized: Invalid user role' });
        }

        if (!id) {
            return res.status(400).json({ message: 'Bad Request: Id is required' });
        }

        const urlMapperItem = await urlMapperRepository.getUrlMapperItemById(id);

        return res.status(200).json(urlMapperItem);
    } catch (error) {
        console.error('Error trying to get urlMapper:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
