import { Ctx, Info, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../../entity/User';
import { isAuth } from '../../../middlewares/isAuth.middleware';
import { MyContext } from '../../../types/MyContext';
import { queryBaseResolver } from '../../baseQuery';

const UserBaseResolver = queryBaseResolver('User', User);

@Resolver()
export default class MeResolver extends UserBaseResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  me(@Ctx() { currentUser }: MyContext, @Info() info) {
    info.cacheControl.setCacheHint({ maxAge: 300, scope: 'PRIVATE' });
    return currentUser;
  }
}
