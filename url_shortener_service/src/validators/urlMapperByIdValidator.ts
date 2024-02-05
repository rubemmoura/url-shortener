import { NextFunction, Request, Response } from 'express';
import { AuthHelper } from '../helpers/authHelper';

export class UrlMapperIdValidator {
    static async validate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        const id: number = parseInt(req.params.id, 10);
        const userRole = await AuthHelper.getUserRole(token);

        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Token is required' });
        } else if (!userRole) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else if (userRole !== 'ADMIN') {
            res.status(401).json({ message: 'Unauthorized: Invalid user role' });
        } else if (!id) {
            res.status(400).json({ message: 'Bad Request: Id is required' });
        } else {
            next();
        }
    }
}
