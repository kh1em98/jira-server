import { User } from './../../entity/User';
import { Mutation, Resolver, Ctx, UseMiddleware, Arg } from 'type-graphql';

import mongoose from 'mongoose';
import { MyContext } from '../../types/MyContext';
import { COOKIE_NAME } from '../../config/constant';

@Resolver()
export default class LogoutResolver {
  @Mutation(() => Boolean)
  async logoutAllDevice(
    @Arg('email') email: string,
    @Ctx() { req, res }: MyContext,
  ) {
    res.clearCookie(COOKIE_NAME);

    await mongoose.connect('mongodb://localhost:27017/social', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const Schema = mongoose.Schema;
    const SessionSchema = new Schema({ _id: String }, { strict: false });
    const Session = mongoose.model('sessions', SessionSchema);

    const user = await User.findOne({
      where: {
        email,
      },
    });

    try {
      await Session.deleteMany({
        session: { $regex: `"userId":${user.id}` },
      }).lean();

      return true;
    } catch (error) {
      return false;
    }
  }
}
