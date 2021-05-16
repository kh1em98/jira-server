import { Resolver, Ctx, Query, UseMiddleware } from 'type-graphql';

import { isAuth, isVerified } from '../../../middlewares/isAuth.middleware';
import { User } from '../../../entity/User';
import { MyContext } from '../../../types/MyContext';

@Resolver()
export default class MeResolver {
  @UseMiddleware(isAuth, isVerified)
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext): User {
    return ctx.req.session.user!;
  }
}
