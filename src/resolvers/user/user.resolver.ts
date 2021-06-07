import {
  Arg,
  Ctx,
  Directive,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { isAuth } from '../../middlewares/isAuth.middleware';
import { MyContext } from '../../types/MyContext';
import { Role, User } from './../../entity/User';

// const UserBaseResolver = queryBaseResolver('User', User);

// export default class UserResolver extends UserBaseResolver {
@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req, currentUser }: MyContext) {
    if (req.session.userId === user.id || currentUser?.role === Role.Admin) {
      return user.email;
    }
    return '';
  }

  @FieldResolver(() => String)
  password(@Root() user: User, @Ctx() { currentUser }: MyContext) {
    if (currentUser?.role === Role.Admin) {
      return user.password;
    }
    return '';
  }

  @UseMiddleware(isAuth)
  @Query(() => [User], { nullable: true })
  getAllUser(@Ctx() { models }: MyContext) {
    return User.find({});
  }

  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  getUserById(@Arg('id') id: number, @Ctx() { models }: MyContext) {
    return models.User.getById(id);
  }

  @UseMiddleware(isAuth)
  @Directive('@onlyAdmin')
  @Mutation(() => Boolean)
  async deleteUserById(@Arg('id') id: number, @Ctx() { models }: MyContext) {
    return User.delete(id);
  }
}
