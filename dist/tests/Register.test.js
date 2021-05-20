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
const InvalidInput_1 = require("../src/shared/test/InvalidInput");
const faker_1 = __importDefault(require("faker"));
const testConn_1 = require("./test-utils/testConn");
const gCall_1 = require("./test-utils/gCall");
const redis_1 = require("../src/redis");
const User_1 = require("../src/entity/User");
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
const registerMutation = `
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			id
			fullName
			email
		}
	}
`;
describe('Register', () => {
    InvalidInput_1.invalidEmailInputTest({
        source: registerMutation,
        otherFieldsInput: {
            fullName: faker_1.default.name.firstName(),
            password: faker_1.default.internet.password(),
        },
    });
    it('create user', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakerUser = {
            fullName: faker_1.default.name.firstName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        };
        const response = yield gCall_1.gCall({
            source: registerMutation,
            variableValues: {
                input: fakerUser,
            },
        });
        expect(response).toMatchObject({
            data: {
                register: {
                    fullName: fakerUser.fullName,
                    email: fakerUser.email,
                },
            },
        });
        const dbUser = yield User_1.User.findOne({ where: { email: fakerUser.email } });
        expect(dbUser).toBeDefined();
        expect(dbUser === null || dbUser === void 0 ? void 0 : dbUser.verified).toBeFalsy();
    }));
});
//# sourceMappingURL=Register.test.js.map