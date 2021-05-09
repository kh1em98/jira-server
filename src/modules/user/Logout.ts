import { Mutation, Resolver, Ctx, UseMiddleware } from 'type-graphql';

import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middlewares/isAuth';

@Resolver()
export default class LogoutResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
		return new Promise((resolve, reject) => {
			req.session.destroy((error) => {
				if (error) {
					reject(false);
				}

				res.clearCookie('sid');

				console.log('req session after delete : ', req.session);

				resolve(true);
			});
		});
	}
}
