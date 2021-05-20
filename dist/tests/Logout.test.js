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
const redis_1 = require("../src/redis");
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
const logoutMutation = `
  mutation {
    logout
  }
`;
describe('Log out', () => {
    it('return true if user already logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield gCall_1.gCall({
            source: logoutMutation,
            sessionData: {
                userId: 1,
            },
        });
        expect(response).toMatchObject({
            data: {
                logout: true,
            },
        });
    }));
    it('return authentication error if user not login but try to logout', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield gCall_1.gCall({
                source: logoutMutation,
            });
        }
        catch (error) {
            expect(error).toEqual('Not authenticated');
        }
    }));
});
//# sourceMappingURL=Logout.test.js.map