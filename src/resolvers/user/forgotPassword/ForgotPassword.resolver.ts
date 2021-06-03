import { Arg, Mutation, Resolver } from 'type-graphql';

import {
  createConfirmationUrl,
  sendEmail,
  TokenPrefix,
} from './../../../utils/mail';
import { User } from '../../../entity/User';

@Resolver()
export default class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      sendEmail(
        user.email,
        await createConfirmationUrl(user.id, TokenPrefix.FORGOT_PASSWORD),
      );

      return true;
    }

    return false;
  }
}
