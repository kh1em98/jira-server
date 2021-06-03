import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import MongoStore from 'connect-mongo';
import { COOKIE_NAME } from './config/constant';
import { PORT } from './config/vars';
import { User } from './entity/User';
import { redis } from './redis';
import { createSchema } from './utils/createSchema';
import { createTaskLoader } from './utils/createTaskLoader';
import { createUserLoader } from './utils/createUserLoader';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    user: User;
  }
}

const connectDbWithRetry = () => {
  createConnection()
    .then(() => {
      console.log('Connected to DB...');
    })
    .catch((error) => {
      if (error) {
        console.error(error);
        setTimeout(connectDbWithRetry, 5000);
      }
    });
};

const main = async () => {
  connectDbWithRetry();
  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({
      req,
      res,
      userLoader: createUserLoader(),
      taskLoader: createTaskLoader(),
    }),
    // Trong trường hợp server có nhiều instance, cần có shared cache để instance này có thể lấy cache của instance kia
    cache: new BaseRedisCache({
      client: redis,
    }),
    tracing: true,
  });

  const app: Application = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: COOKIE_NAME,
      secret: 'aslkdfjoiq12312',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 2,
      },
    }),
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.use((req: Request, res: Response) => {
    console.log('cookie : ', req.cookies);
    console.log('signed cookie : ', req.signedCookies);
    res.status(404).send('Not found');
  });

  app.listen(PORT, async () => {
    console.log(`server started on http://localhost:${PORT}/graphql`);
  });
};

main();
