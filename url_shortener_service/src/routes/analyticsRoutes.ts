import express, { Request, Response } from 'express';
import UrlMapperController from '../controllers/UrlMapperController';
import { UrlMapperIdValidator } from '../validators/urlMapperByIdValidator';
import { UrlMapperValidator } from '../validators/urlMapperValidator';

const router = express.Router();
const urlMapperController = new UrlMapperController();
const jwtSecret = process.env.JWT_SECRET || '';

router.get('/url', UrlMapperValidator.validate, async (req: Request, res: Response) => {
    await urlMapperController.getAllUrlMapper(req, res);
});

router.get('/url/:id', UrlMapperIdValidator.validate, async (req: Request, res: Response) => {
    await urlMapperController.getUrlMapperById(req, res);
});

export default router;
