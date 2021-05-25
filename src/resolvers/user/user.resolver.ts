import { User } from './../../entity/User';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';

import { MyContext } from '../../types/MyContext';
import { queryBaseResolver } from '../baseQuery';

const UserBaseResolver = queryBaseResolver('User', User);

@Resolver(User)
export default class UserResolver extends UserBaseResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return '';
  }
}
