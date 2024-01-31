import { Request, Response, NextFunction } from 'express';
import { UrlMapperIdValidator } from '../../validators/urlMapperByIdValidator';
import { AuthHelper } from '../../helpers/authHelper';

describe('UrlMapperIdValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: { authorization: 'valid_token' },
            params: { id: '123' }
        };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should return 401 if token is missing', async () => {
        delete req.headers?.authorization;
        await UrlMapperIdValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is required' });
    });

    test('validate() should return 401 if token is invalid', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce(undefined);
        await UrlMapperIdValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    });

    test('validate() should return 401 if user role is not ADMIN', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce('USER');
        await UrlMapperIdValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid user role' });
    });

    test('validate() should return 400 if id is missing', async () => {
        delete req.params?.id;
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce('ADMIN');
        await UrlMapperIdValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Bad Request: Id is required' });
    });

    test('validate() should call next() if token, user role, and id are provided', async () => {
        jest.spyOn(AuthHelper, 'getUserRole').mockResolvedValueOnce('ADMIN');
        await UrlMapperIdValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });
});
