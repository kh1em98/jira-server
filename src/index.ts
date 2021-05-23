import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { createConnection } from 'typeorm';
import session from 'express-session';
declare module 'express-session' {
  export interface SessionData {
    userId: number;
    user: User;
  }
}

import connectRedis from 'connect-redis';
import cors from 'cors';

import { redis } from './redis';
import { User } from './entity/User';
import { createSchema } from './utils/createSchema';
import { createUserLoader } from './utils/createUserLoader';
import { PORT } from './config/vars';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { createTaskLoader } from './utils/createTaskLoader';

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
      name: 'sid',
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

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, async () => {
    console.log(`server started on http://localhost:${PORT}/graphql`);
  });
};

main();
