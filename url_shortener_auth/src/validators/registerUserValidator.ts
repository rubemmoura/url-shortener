import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class RegisterUserValidator {
    private static schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('ADMIN', 'USER').required()
    });

    static validate(req: Request, res: Response, next: NextFunction) {
        const { error, value } = RegisterUserValidator.schema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: 'Body error', details: error.details });
        }

        req.body = value;
        next();
    }
}
