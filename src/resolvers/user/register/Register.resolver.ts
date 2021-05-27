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
import { IError } from '../../../shared/error/Error';

@ObjectType({ implements: IError })
class EmailExistedError {
  @Field()
  message: string;
}

const RegisterPayload = createUnionType({
  name: 'RegisterPayload',
  types: () => [User, EmailExistedError, InputValidationError],
  // resolveType(value) {

  // },
});

@Resolver()
export default class RegisterResolver {
  @Mutation(() => RegisterPayload)
  async register(@Arg('input') input: RegisterInput) {
    const { email, fullName, password } = input;
    const { error } = registerSchema.validate(input);

    if (error) {
      return {
        message: error.message,
      };
    }

    const isEmailExisted = await User.findOne({ where: { email } });

    if (isEmailExisted) {
      return {
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

      sendEmail(user.email, await createConfirmationUrl(user.id));

      return user;
    } catch (error) {
      console.log('error : ', error.message);
      return {
        message: `Error : ${error.message}`,
      };
    }
  }
}
