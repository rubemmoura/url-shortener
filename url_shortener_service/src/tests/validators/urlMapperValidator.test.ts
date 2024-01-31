import { Request, Response, NextFunction } from 'express';
import { AuthHelper } from '../../helpers/authHelper';
import { UrlMapperValidator } from '../../validators/urlMapperValidator';

describe('UrlMapperValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { headers: { authorization: 'valid_token' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should return 401 if token is missing', async () => {
        delete req.headers?.authorization;
        await UrlMapperValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is required' });
    });

    test('validate() should return 401 if token is invalid', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce(undefined);
        await UrlMapperValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    });

    test('validate() should return 401 if user role is not ADMIN', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce('USER');
        await UrlMapperValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid user role' });
    });

    test('validate() should call next() if token and user role are provided', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce('ADMIN');
        await UrlMapperValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
