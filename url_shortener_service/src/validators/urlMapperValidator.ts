import { Request, Response, NextFunction } from 'express';
import { AuthHelper } from '../helpers/authHelper';

export class UrlMapperValidator {
    static async validate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        const userRole = await AuthHelper.getUserRole(token);

        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Token is required' });
        } else if (!userRole) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else if (userRole !== 'ADMIN') {
            res.status(401).json({ message: 'Unauthorized: Invalid user role' });
        } else {
            next();
        }
    }
}
