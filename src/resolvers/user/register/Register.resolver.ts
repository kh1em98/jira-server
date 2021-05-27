import {
  Arg,
  createUnionType,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import { sendEmail, createConfirmationUrl } from '../../../utils/mail';
import { User } from '../../../entity/User';
import { RegisterInput } from './RegisterInput';
import { ApolloError } from 'apollo-server-express';
import { registerSchema } from '../../../validations/auth.validation';
import { InputValidationError } from '../../../shared/error/InputValidationError';
import { Error } from '../../../shared/error/Error';

@ObjectType({ implements: Error })
class EmailExistedError {
  @Field()
  message: string;
}

const RegisterPayload = createUnionType({
  name: 'RegisterPayload',
  types: () => [User, EmailExistedError, InputValidationError] as const,
  resolveType(value) {
    if ('id' in value) {
      return User;
    }
    if ('field' in value) {
      return InputValidationError;
    }
    if ('message' in value) {
      return EmailExistedError;
    }
    return null;
  },
});

@Resolver()
export default class RegisterResolver {
  @Mutation(() => RegisterPayload)
  async register(@Arg('input') input: RegisterInput) {
    const { email, password, fullName } = input;
    const { error } = registerSchema.validate(input);

    console.log('error : ', error);

    if (error) {
      return {
        __typename: 'InputValidationError',
        message: error.message,
      };
    }

    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      return {
        __typename: 'EmailExistedError',
        message: `${email} has already been registered`,
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        fullName,
        email,
        password: hashPassword,
      }).save();

      console.log('user : ', user);

      sendEmail(user.email, await createConfirmationUrl(user.id));

      return {
        __typename: 'User',
        ...user,
      };
    } catch (error) {
      console.log('error : ', error.message);
      return {
        message: `Error : ${error.message}`,
      };
    }
  }
}
