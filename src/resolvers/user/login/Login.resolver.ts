import {
  Arg,
  Mutation,
  Resolver,
  Field,
  InputType,
  Ctx,
  createUnionType,
  ObjectType,
} from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../../entity/User';
import { MyContext } from '../../../types/MyContext';
import {
  createConfirmationUrl,
  sendEmail,
  TokenPrefix,
} from '../../../utils/mail';
import { Error } from '../../../shared/error/Error';
import { loginSchema } from '../../../validations/auth.validation';
import { InputValidationError } from '../../../shared/error/InputValidationError';

@ObjectType({ implements: Error })
class CredentialsError {
  constructor(_message: string, _field: string) {
    this.message = _message;
    this.field = _field;
  }

  @Field()
  message: string;

  @Field()
  field: string;
}

const LoginResponse = createUnionType({
  name: 'LoginPayload',
  types: () => [User, CredentialsError, InputValidationError] as const,
});

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export default class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext,
  ) {
    const { error } = loginSchema.validate({
      email,
      password,
    });

    if (error) {
      return new InputValidationError(error.message, error?.details[0].path);
    }

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return new CredentialsError('Wrong email', 'email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return new CredentialsError('Wrong password', 'password');
    }

    ctx.req.session.userId = user.id;

    if (!user.verified) {
      sendEmail(
        user.email,
        await createConfirmationUrl(user.id, TokenPrefix.VERIFY_EMAIL),
      );
    }

    return user;
  }
}
