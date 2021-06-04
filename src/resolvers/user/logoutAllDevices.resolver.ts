import mongoose from 'mongoose';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { COOKIE_NAME } from '../../config/constant';
import { MyContext } from '../../types/MyContext';
import { User } from './../../entity/User';

@Resolver()
export default class LogoutResolver {
  @Mutation(() => Boolean)
  async logoutAllDevice(
    @Arg('email') email: string,
    @Ctx() { res }: MyContext,
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
