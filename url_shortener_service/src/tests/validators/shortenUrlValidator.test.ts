import { Request, Response, NextFunction } from 'express';
import { ShortenUrlValidator } from '../../validators/shortenUrlValidator';
import { AuthHelper } from '../../helpers/authHelper';

describe('ShortenUrlValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: { authorization: 'valid_token' },
            body: { url: 'http://longUrlExample.com' }
        };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should return 401 if token is missing', async () => {
        delete req.headers?.authorization;
        await ShortenUrlValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is required' });
    });

    test('validate() should return 400 if URL is missing', async () => {
        delete req.body.url;
        await ShortenUrlValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'URL is required' });
    });

    test('validate() should return 401 if token is invalid', async () => {
        jest.spyOn(AuthHelper, 'verifyToken').mockResolvedValueOnce(null);
        await ShortenUrlValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    });

    test('validate() should call next() if token and URL are provided and token is valid', async () => {
        jest.spyOn(AuthHelper, 'verifyToken').mockResolvedValueOnce({ email: 'email', role: 'role', userId: 1 });
        await ShortenUrlValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 401 if an internal error occurs verifying token', async () => {
        jest.spyOn(AuthHelper, 'verifyToken').mockRejectedValueOnce(new Error('Internal server error'));
        await ShortenUrlValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    });
});
