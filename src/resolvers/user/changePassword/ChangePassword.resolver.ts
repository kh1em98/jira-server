import bcrypt from 'bcrypt';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../../entity/User';
import { redis } from '../../../redis';
import { TokenPrefix } from './../../../utils/mail';

@Resolver()
export default class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async changePassword(
    @Arg('password') password: string,
    @Arg('token') token: string,
  ): Promise<boolean> {
    const userId = await redis.get(`${TokenPrefix.FORGOT_PASSWORD}:${token}`);

    if (!userId) {
      return false;
    }

    const user = await User.findOne(parseInt(userId, 10));

    if (!user) {
      return false;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    try {
      await User.update(user.id, user);

      await redis.del(token);

      return true;
    } catch (error) {
      console.log('error update password : ', error);
      return false;
    }
  }
}
