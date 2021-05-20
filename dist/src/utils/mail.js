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
exports.sendEmail = exports.createConfirmationUrl = exports.PREFIX_VERIFY_EMAIL = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const uuid_1 = require("uuid");
const redis_1 = require("../redis");
exports.PREFIX_VERIFY_EMAIL = 'VERIFY_EMAIL';
function createConfirmationUrl(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = uuid_1.v4();
        yield redis_1.redis.set(`${exports.PREFIX_VERIFY_EMAIL}${id}`, userId, 'ex', 60 * 60);
        return id;
    });
}
exports.createConfirmationUrl = createConfirmationUrl;
function sendEmail(email, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const testAccount = yield nodemailer_1.default.createTestAccount();
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        const info = yield transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: 'Hello ✔',
            text: 'Hello world?',
            html: `<a href="${url}">${url}</a>`,
        });
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
    });
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=mail.js.map