import {
  Arg,
  createUnionType,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import { sendEmail, createConfirmationUrl } from '../../../utils/mail';
import { User } from '../../../entity/User';
import { RegisterInput } from './RegisterInput';
import { registerSchema } from '../../../validations/auth.validation';
import { InputValidationError } from '../../../shared/error/InputValidationError';
import { Error } from '../../../shared/error/Error';

@ObjectType({ implements: Error })
class EmailExistedError {
  constructor(_message: string) {
    this.message = _message;
  }

  @Field()
  message: string;
}

const RegisterPayload = createUnionType({
  name: 'RegisterPayload',
  types: () => [User, EmailExistedError, InputValidationError] as const,
});

@Resolver()
export default class RegisterResolver {
  @Mutation(() => RegisterPayload)
  async register(@Arg('input') input: RegisterInput) {
    const { email, password, fullName } = input;
    const { error } = registerSchema.validate(input);

    if (error) {
      return new InputValidationError(error.message, error?.details[0].path);
    }

    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      return new EmailExistedError(`${email} has already been registered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashPassword,
    }).save();

    sendEmail(user.email, await createConfirmationUrl(user.id));

    return user;
  }
}
