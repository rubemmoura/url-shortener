import { NextFunction, Request, Response } from 'express';

export class VerifyTokenValidator {
    static validate(req: Request, res: Response, next: NextFunction): void {
        try {
            const token = req.body.token;

            if (!token) {
                res.status(400).json({ message: 'Token is required' });
                return;
            }

            next();
        } catch (error) {
            console.error('Error trying to verify token:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
