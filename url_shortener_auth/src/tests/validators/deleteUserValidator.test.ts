import { Request, Response, NextFunction } from 'express';
import { DeleteUserValidator } from '../../validators/deleteUserValidator';

describe('DeleteUserValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { email: 'test@example.com' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should call next() if validation passes', () => {
        DeleteUserValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is missing', () => {
        req.body = { email: '' };
        DeleteUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is invalid', () => {
        req.body = { email: 'invalid-email' };
        DeleteUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});
