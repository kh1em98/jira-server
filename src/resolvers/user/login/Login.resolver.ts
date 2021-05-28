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
import { createConfirmationUrl, sendEmail } from '../../../utils/mail';
import { IsEmail } from 'class-validator';
import { Error } from '../../../shared/error/Error';

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

const LoginPayload = createUnionType({
  name: 'LoginPayload',
  types: () => [User, CredentialsError] as const,
});

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@Resolver()
export default class LoginResolver {
  @Mutation(() => LoginPayload)
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: MyContext,
  ) {
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
      sendEmail(user.email, await createConfirmationUrl(user.id));
    }

    return user;
  }
}
