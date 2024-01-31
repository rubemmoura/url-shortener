import { Request, Response, NextFunction } from 'express';
import { RegisterUserValidator } from '../../validators/registerUserValidator';

describe('RegisterUserValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { email: 'test@example.com', password: 'password', role: 'ADMIN' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should call next() if validation passes', () => {
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should call next() if validation passes with role USER', () => {
        req.body.role = 'USER'
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is invalid', () => {
        req.body = { email: 'invalid-email', password: 'password', role: 'ADMIN' };
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if password is empty', () => {
        req.body = { email: 'test@example.com', password: '', role: 'ADMIN' };
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is empty', () => {
        req.body = { email: '', password: 'password', role: 'ADMIN' };
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if role is invalid', () => {
        req.body = { email: 'test@example.com', password: 'password', role: 'INVALID_ROLE' };
        RegisterUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});
