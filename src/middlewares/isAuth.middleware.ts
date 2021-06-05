import { MiddlewareFn } from 'type-graphql';
import { COOKIE_NAME } from '../config/constant';
import { MyContext } from '../types/MyContext';

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { res, currentUser } },
  next,
) => {
  if (!currentUser) {
    res.clearCookie(COOKIE_NAME);
    throw new Error('Not authenticated');
  }

  return next();
};

export const isVerified: MiddlewareFn<MyContext> = async (
  { context: { currentUser } },
  next,
) => {
  if (!currentUser || !currentUser.verified) {
    throw new Error('User is not verified');
  }
  return next();
};
