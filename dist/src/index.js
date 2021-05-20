"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("./redis");
const createSchema_1 = require("./utils/createSchema");
const createUserLoader_1 = require("./utils/createUserLoader");
const vars_1 = require("./config/vars");
const vars_2 = require("./config/vars");
const apollo_server_cache_redis_1 = require("apollo-server-cache-redis");
const connectDbWithRetry = () => {
    typeorm_1.createConnection({
        name: 'default',
        type: 'postgres',
        host: vars_2.DB_HOST || '127.0.0.1',
        port: vars_2.DB_PORT ? parseInt(vars_2.DB_PORT, 10) : 5432,
        username: vars_2.DB_USERNAME || 'khiem',
        password: vars_2.DB_PASSWORD || 'khiem',
        database: vars_2.DB_NAME,
        synchronize: true,
        logging: true,
        entities: ['src/entity/*.*'],
    })
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    connectDbWithRetry();
    const schema = yield createSchema_1.createSchema();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
            userLoader: createUserLoader_1.createUserLoader(),
        }),
        cache: new apollo_server_cache_redis_1.BaseRedisCache({
            client: redis_1.redis,
        }),
        tracing: true,
    });
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    app.use(cors_1.default({
        credentials: true,
        origin: 'http://localhost:3000',
    }));
    app.use(express_session_1.default({
        store: new RedisStore({
            client: redis_1.redis,
        }),
        name: 'sid',
        secret: 'aslkdfjoiq12312',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 2,
        },
    }));
    apolloServer.applyMiddleware({ app });
    app.listen(vars_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`server started on http://localhost:${vars_1.PORT}/graphql`);
    }));
});
main();
//# sourceMappingURL=index.js.map