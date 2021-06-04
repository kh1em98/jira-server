import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../../entity/User';
import { isAuth } from '../../../middlewares/isAuth.middleware';
import { MyContext } from '../../../types/MyContext';
import { queryBaseResolver } from '../../baseQuery';

const UserBaseResolver = queryBaseResolver('User', User);

@Resolver()
export default class MeResolver extends UserBaseResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    try {
      const user = await User.findOne({
        where: { id: ctx.req.session.userId },
      });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
