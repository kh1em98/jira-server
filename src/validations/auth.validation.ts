import Joi from 'joi';
import { password } from './custom.validation';

export const registerSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
  password: Joi.string().required().custom(password),
  fullName: Joi.string().required(),
});
