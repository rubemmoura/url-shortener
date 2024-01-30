import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class DeleteUserValidator {
    private static schema = Joi.object({
        email: Joi.string().email().required()
    });

    static validate(req: Request, res: Response, next: NextFunction) {
        const { error, value } = DeleteUserValidator.schema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: 'Body error', details: error.details });
        }

        req.body = value;
        next();
    }
}
