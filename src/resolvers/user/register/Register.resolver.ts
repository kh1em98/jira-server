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

@ObjectType()
class EmailExistedError {
  @Field()
  errorMsg: string;
}

const RegisterPayload = createUnionType({
  name: 'RegisterPayload',
  types: () => [User, EmailExistedError],
  resolveType(value) {
    if ('errorMsg' in value) {
      return EmailExistedError;
    } else {
      return User;
    }
  },
});

@Resolver()
export default class RegisterResolver {
  @Mutation(() => RegisterPayload)
  async register(@Arg('input') { fullName, email, password }: RegisterInput) {
    const hashPassword = await bcrypt.hash(password, 10);

    const isEmailExsited = await User.findOne({ where: { email } });
    if (isEmailExsited) {
      return {
        errorMsg: `${email} has already been registered`,
      };
    }

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
        errorMsg: `Error : ${error.message}`,
      };
    }
  }
}
