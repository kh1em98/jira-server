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
exports.isVerified = exports.isAuth = void 0;
const User_1 = require("../entity/User");
const isAuth = ({ context: { req, res } }, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('session : ', req.session.userId);
    if (!req.session.userId) {
        res.clearCookie('sid');
        throw new Error('Not authenticated');
    }
    return next();
});
exports.isAuth = isAuth;
const isVerified = ({ context: { req } }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const user = yield User_1.User.findOne(userId);
    if (!user || !user.verified) {
        throw new Error('User is not verified');
    }
    req.session.user = user;
    return next();
});
exports.isVerified = isVerified;
//# sourceMappingURL=isAuth.middleware.js.map