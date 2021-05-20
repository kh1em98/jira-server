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
exports.invalidEmailInputTest = void 0;
const gCall_1 = require("../../../tests/test-utils/gCall");
const invalidEmailInputTest = ({ source, otherFieldsInput, }) => {
    describe('test invalid email', () => {
        test('not allow user to enter invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidEmail = 'khiem';
            const response = yield gCall_1.gCall({
                source,
                variableValues: {
                    input: Object.assign(Object.assign({}, otherFieldsInput), { email: invalidEmail }),
                },
            });
            expect(response.errors[0]).toMatchObject({
                message: 'Argument Validation Error',
            });
        }));
    });
};
exports.invalidEmailInputTest = invalidEmailInputTest;
//# sourceMappingURL=InvalidInput.js.map