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
const faker_1 = __importDefault(require("faker"));
const redis_1 = require("./../src/redis");
const User_1 = require("../src/entity/User");
const gCall_1 = require("./test-utils/gCall");
const testConn_1 = require("./test-utils/testConn");
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConn_1.testConnectionDB();
    if (redis_1.redis.status === 'end') {
        yield redis_1.redis.connect();
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redis.disconnect();
    yield conn.close();
}));
const meQuery = `
 {
  me {
    id
    fullName
    email
  }
}
`;
describe('Me', () => {
    it('get current user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.User.create({
            fullName: faker_1.default.name.firstName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        }).save();
        const response = yield gCall_1.gCall({
            source: meQuery,
            sessionData: {
                userId: user.id,
            },
        });
        expect(response).toMatchObject({
            data: {
                me: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
            },
        });
    }));
    it('return null', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield gCall_1.gCall({
            source: meQuery,
        });
        expect(response).toMatchObject({
            data: {
                me: null,
            },
        });
    }));
});
//# sourceMappingURL=Me.test.js.map