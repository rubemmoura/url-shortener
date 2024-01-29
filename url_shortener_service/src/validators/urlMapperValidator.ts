import { Request, Response, NextFunction } from 'express';
import { AuthHelper } from '../helpers/authHelper';

export class UrlMapperValidator {
    static async validate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        const userRole = await UrlMapperValidator.getUserRole(token);

        if (!token || !userRole) {
            res.status(401).json({ message: 'Unauthorized: Token is required' });
        } else if (userRole !== 'ADMIN') {
            res.status(401).json({ message: 'Unauthorized: Invalid user role' });
        } else {
            next();
        }
    }

    private static async getUserRole(token: string | undefined): Promise<string | undefined> {
        try {
            if (!token) return undefined;

            const decodedToken = await AuthHelper.verifyToken(token);
            return decodedToken.role;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
}
