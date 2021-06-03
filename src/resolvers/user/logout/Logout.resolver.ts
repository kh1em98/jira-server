import { Mutation, Resolver, Ctx, UseMiddleware } from 'type-graphql';

import { isAuth } from '../../../middlewares/isAuth.middleware';
import { MyContext } from '../../../types/MyContext';
import { COOKIE_NAME } from '../../../config/constant';

@Resolver()
export default class LogoutResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        res.clearCookie(COOKIE_NAME);
        if (error) {
          reject(false);
        }

        resolve(true);
      });
    });
  }
}
