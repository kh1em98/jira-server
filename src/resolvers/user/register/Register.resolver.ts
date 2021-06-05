import {
  Arg,
  createUnionType,
  Ctx,
  Field,
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
import { RegisterInput } from './RegisterInput';

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
    try {
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
    } catch (error) {
      return error;
    }
  }
}
