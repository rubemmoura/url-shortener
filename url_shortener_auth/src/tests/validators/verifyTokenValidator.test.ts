import { Request, Response, NextFunction } from 'express';
import { VerifyTokenValidator } from '../../validators/verifyTokenValidator';

describe('VerifyTokenValidator', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: { token: 'valid_token' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('validate() should call next() if token is provided', () => {
        VerifyTokenValidator.validate(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    test('validate() should return 400 if token is not provided', () => {
        req.body = {};
        VerifyTokenValidator.validate(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});
