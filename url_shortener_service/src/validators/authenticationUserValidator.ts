import Joi from 'joi';

class AuthenticationUserValidator {
    public schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    public validate(data: any) {
        return this.schema.validate(data);
    }
}

export default new AuthenticationUserValidator();
