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
exports.connectDbWithRetry = void 0;
const typeorm_1 = require("typeorm");
const faker_1 = __importDefault(require("faker"));
const User_1 = require("../entity/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const vars_1 = require("../config/vars");
const connectDbWithRetry = () => __awaiter(void 0, void 0, void 0, function* () {
    typeorm_1.createConnection({
        name: 'default',
        type: 'postgres',
        host: vars_1.DB_HOST || '127.0.0.1',
        port: vars_1.DB_PORT ? parseInt(vars_1.DB_PORT, 10) : 5432,
        username: vars_1.DB_USERNAME || 'khiem',
        password: vars_1.DB_PASSWORD || 'khiem',
        database: vars_1.DB_NAME,
        synchronize: true,
        dropSchema: true,
        logging: true,
        entities: ['src/entity/*.*'],
    });
});
exports.connectDbWithRetry = connectDbWithRetry;
const createSeedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.connectDbWithRetry();
        const password = '123456';
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        for (let i = 0; i < 10; i++) {
            yield User_1.User.create({
                fullName: faker_1.default.name.firstName() + ' ' + faker_1.default.name.lastName(),
                email: faker_1.default.internet.email(),
                password: hashPassword,
            }).save();
        }
    }
    catch (error) {
        console.log('create seed user error : ', error);
    }
});
createSeedUser();
//# sourceMappingURL=createUser.js.map