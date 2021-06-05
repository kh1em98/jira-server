import { BaseRedisCache } from 'apollo-server-cache-redis';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import MongoStore from 'connect-mongo';
import { COOKIE_NAME } from './config/constant';
import { PORT, __prod__ } from './config/vars';
import { User } from './entity/User';
import { redis } from './redis';
import { createSchema } from './utils/createSchema';
import { createUserLoader } from './utils/createUserLoader';
import OnlyAdminDirective from './directives/onlyAdmin';
import { generateTaskModel } from './models/Task';
import { generateUserModel } from './models/User';

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    user: User;
  }
}

const connectDbWithRetry = () => {
  createConnection()
    .then(async (conn) => {
      await conn.runMigrations();
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
    schemaDirectives: {
      onlyAdmin: OnlyAdminDirective,
    },
    context: async ({ req, res }: any) => {
      const currentUser = await User.findOne({
        where: {
          id: req.session?.userId,
        },
      });

      return {
        req,
        res,
        currentUser,
        userLoader: createUserLoader(),
        models: {
          User: generateUserModel(currentUser),
          Task: generateTaskModel(currentUser),
        },
      };
    },
    // Trong trường hợp server có nhiều instance, cần có shared cache để instance này có thể lấy cache của instance kia
    cache: new BaseRedisCache({
      client: redis,
    }),
    // Ko muon hien thi error va debug cho End-User
    tracing: !__prod__,
    debug: !__prod__,
  });

  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    onlyAdmin: OnlyAdminDirective,
  });

  const app: Application = express();

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  );

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/social',
        touchAfter: 24 * 3600,
      }),
      name: COOKIE_NAME,
      secret: 'aslkdfjoiq12312',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 day
      },
    }),
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.use((req: Request, res: Response) => {
    res.status(404).send('Not found');
  });

  app.listen(PORT, async () => {
    console.log(`server started on http://localhost:${PORT}/graphql`);
  });
};

main();
