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
const testConn_1 = require("./test-utils/testConn");
const gCall_1 = require("./test-utils/gCall");
const redis_1 = require("../src/redis");
const User_1 = require("../src/entity/User");
const InvalidInput_1 = require("../src/shared/test/InvalidInput");
const bcrypt_1 = __importDefault(require("bcrypt"));
let conn;
let passwordBeforeHash;
let testUser;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = yield testConn_1.testConnectionDB();
    if (redis_1.redis.status === 'end') {
        yield redis_1.redis.connect();
    }
    passwordBeforeHash = faker_1.default.internet.password();
    const hashPassword = yield bcrypt_1.default.hash(passwordBeforeHash, 10);
    testUser = yield User_1.User.create({
        fullName: faker_1.default.name.firstName(),
        email: faker_1.default.internet.email(),
        password: hashPassword,
    }).save();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redis.disconnect();
    yield conn.close();
}));
const loginMutation = `
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			id
		}
	}
`;
describe('Login', () => {
    InvalidInput_1.invalidEmailInputTest({
        source: loginMutation,
        otherFieldsInput: {
            password: faker_1.default.internet.password(),
        },
    });
    test('enter not exist email', () => __awaiter(void 0, void 0, void 0, function* () {
        const notExistEmail = `abc${testUser.email}`;
        const response = yield gCall_1.gCall({
            source: loginMutation,
            variableValues: {
                input: {
                    email: notExistEmail,
                    password: testUser.password,
                },
            },
        });
        expect(response).toMatchObject({
            data: {
                login: null,
            },
        });
    }));
    test('enter wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongPassword = `${testUser.password}123`;
        const response = yield gCall_1.gCall({
            source: loginMutation,
            variableValues: {
                input: {
                    email: testUser.email,
                    password: wrongPassword,
                },
            },
        });
        expect(response).toMatchObject({
            data: {
                login: null,
            },
        });
    }));
    test('enter correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield gCall_1.gCall({
            source: loginMutation,
            variableValues: {
                input: {
                    email: testUser.email,
                    password: passwordBeforeHash,
                },
            },
        });
        expect(response).toMatchObject({
            data: {
                login: {
                    id: testUser.id,
                },
            },
        });
    }));
});
//# sourceMappingURL=Login.test.js.map