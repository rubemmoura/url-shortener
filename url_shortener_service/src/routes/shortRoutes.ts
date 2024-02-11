import express, { Request, Response } from 'express';
import ShortenUrlController from '../controllers/ShortenUrlController';
import { ShortenUrlValidator } from '../validators/shortenUrlValidator';

const router = express.Router();
const shortenUrlController = new ShortenUrlController();
const jwtSecret = process.env.JWT_SECRET || '';

router.get('/:hash', async (req: Request, res: Response) => {
    await shortenUrlController.redirectToLongUrl(req, res);
});

router.post('/shorten', ShortenUrlValidator.validate, async (req: Request, res: Response) => {
    await shortenUrlController.shortenUrl(req, res);
});

export default router;
