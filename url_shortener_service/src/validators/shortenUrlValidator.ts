import { Request, Response, NextFunction } from 'express';
import { AuthHelper } from '../helpers/authHelper';

export class ShortenUrlValidator {
    static async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization;
            const longUrl: string = req.body.url;

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: Token is required' });
            }

            if (!longUrl) {
                return res.status(400).json({ message: 'URL is required' });
            }

            try {
                const decodedToken = await AuthHelper.verifyToken(token);
                if (!decodedToken) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }

            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
