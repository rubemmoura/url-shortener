import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export class AuthenticationUserValidator {
    private static schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    static validate(req: Request, res: Response, next: NextFunction) {
        const { error, value } = AuthenticationUserValidator.schema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: 'Body error', details: error.details });
        }

        req.body = value;
        next();
    }
}