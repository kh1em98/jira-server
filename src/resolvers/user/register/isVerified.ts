import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class IsAccountVerifiedConstraint
  implements ValidatorConstraintInterface
{
  validate(email: string) {
    return User.findOne({
      where: { email: email },
    }).then((user) => {
      if (!user || !user.verified) return false;
      return true;
    });
  }
}

export function IsAccountVerified(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAccountVerifiedConstraint,
    });
  };
}
