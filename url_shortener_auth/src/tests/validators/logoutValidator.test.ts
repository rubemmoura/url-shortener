import { Request, Response, NextFunction } from 'express';
import { LogoutValidator } from '../../validators/logoutValidator';

describe('LogoutValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { token: 'testToken' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should call next() if token is provided', () => {
        LogoutValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 400 if token is not provided', () => {
        req.body = {};
        LogoutValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});
