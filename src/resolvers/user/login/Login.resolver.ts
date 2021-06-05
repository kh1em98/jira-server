import {
  Arg,
  createUnionType,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { User } from '../../../entity/User';
import { Error } from '../../../shared/error/Error';
import { InputValidationError } from '../../../shared/error/InputValidationError';
import { MyContext } from '../../../types/MyContext';
import {
  createConfirmationUrl,
  sendEmail,
  TokenPrefix,
} from '../../../utils/mail';

@ObjectType({ implements: Error })
export class CredentialsError {
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
    @Ctx() { req, models }: MyContext,
  ) {
    try {
      const user = await models.User.login({ email, password });

      req.session.userId = user.id;

      if (!user.verified) {
        sendEmail(
          user.email,
          await createConfirmationUrl(user.id, TokenPrefix.VERIFY_EMAIL),
        );
      }

      return user;
    } catch (error) {
      return error;
    }
  }
}
