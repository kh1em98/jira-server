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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnectionDB = void 0;
require("dotenv/config");
const vars_1 = require("./../../src/config/vars");
const typeorm_1 = require("typeorm");
const vars_2 = require("../../src/config/vars");
const testConnectionDB = (needDrop = false) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ DB_PASSWORD: vars_2.DB_PASSWORD, DB_TEST_NAME: vars_2.DB_TEST_NAME, DB_USERNAME: vars_2.DB_USERNAME });
    return yield typeorm_1.createConnection({
        name: 'default',
        type: 'postgres',
        host: vars_1.DB_HOST || '127.0.0.1',
        port: vars_1.DB_PORT ? parseInt(vars_1.DB_PORT, 10) : 5432,
        username: vars_2.DB_USERNAME,
        password: vars_2.DB_PASSWORD,
        database: vars_2.DB_TEST_NAME,
        synchronize: needDrop,
        dropSchema: needDrop,
        entities: ['./src/entity/*.*'],
    });
});
exports.testConnectionDB = testConnectionDB;
//# sourceMappingURL=testConn.js.map