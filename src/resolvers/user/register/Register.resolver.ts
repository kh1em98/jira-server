import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import {
  sendEmail,
  createConfirmationUrl,
  TokenPrefix,
} from '../../../utils/mail';
import { User } from '../../../entity/User';
import { RegisterInput } from './RegisterInput';
import { registerSchema } from '../../../validations/auth.validation';
import { InputValidationError } from '../../../shared/error/InputValidationError';
import { Error } from '../../../shared/error/Error';
import { MyContext } from '../../../types/MyContext';

@ObjectType({ implements: Error })
export class EmailExistedError {
  constructor(_message: string) {
    this.message = _message;
  }

  @Field()
  message: string;
}

const RegisterResponse = createUnionType({
  name: 'RegisterPayload',
  types: () => [User, EmailExistedError, InputValidationError] as const,
});

@Resolver()
export default class RegisterResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('input') { email, password, firstName, lastName }: RegisterInput,
    @Ctx() { models, req }: MyContext,
  ) {
    const { error } = registerSchema.validate({
      email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      return new InputValidationError(error.message, error?.details[0].path);
    }

    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      return new EmailExistedError(`${email} has already been registered`);
    }

    const user = await models.User.create({
      firstName,
      lastName,
      email,
      password,
    });

    req.session.userId = user.id;

    sendEmail(
      user.email,
      await createConfirmationUrl(user.id, TokenPrefix.VERIFY_EMAIL),
    );

    return user;
  }
}
