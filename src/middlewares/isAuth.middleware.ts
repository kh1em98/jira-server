import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';
import { User } from '../entity/User';
import { COOKIE_NAME } from '../config/constant';
import cookie from 'cookie-signature';

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req, res } },
  next,
) => {
  const val = cookie.unsign(
    'aslkdfjoiq12312',
    's%3AkCthYKeqXQOZr6PGLMpBluQkpO5cLxdp.UmFzHTgiFwZkNP5r1pCaN%2F9qNlC%2FeJhfKhxTTgJY0PE',
  );

  console.log('val : ', val);

  if (!req.session.userId) {
    throw new Error('Not authenticated');
  }

  try {
    const user = await User.findOne({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      throw new Error('Not authenticated');
    }

    (req as any).user = user;
    return next();
  } catch (error) {
    res.clearCookie(COOKIE_NAME);
    throw new Error('Not authenticated');
  }
};

export const isVerified: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next,
) => {
  const userId = req.session.userId;

  const user = await User.findOne(userId);

  if (!user || !user.verified) {
    throw new Error('User is not verified');
  }

  if (!(req as any).user) {
    (req as any).user = user;
  }

  return next();
};
