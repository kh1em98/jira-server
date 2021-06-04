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

    try {
      await mongoose.connect('mongodb://localhost:27017/social', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.log('connect mongo error : ', error);
    }

    const Schema = mongoose.Schema;
    const SessionSchema = new Schema({ _id: String }, { strict: false });
    const Session = mongoose.model('sessions', SessionSchema);

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      await Session.deleteMany({
        session: { $regex: `"userId":${user?.id}` },
      }).lean();

      return true;
    } catch (error) {
      return false;
    }
  }
}
