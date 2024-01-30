import { Request, Response, NextFunction } from 'express';
import { AuthenticationUserValidator } from '../../src/validators/authenticationUserValidator';

describe('AuthenticationUserValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { email: 'test@example.com', password: 'password' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should call next() if validation passes', () => {
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is empty', () => {
        req.body = { email: '', password: 'password' };
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if password is empty', () => {
        req.body = { email: 'test@example.com', password: '' };
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is not provided', () => {
        req.body = { password: 'password' };
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if password is not provided', () => {
        req.body = { email: 'test@example.com' };
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test('validate() should return 400 if email is invalid', () => {
        req.body = { email: 'invalid-email', password: 'password' };
        AuthenticationUserValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});
