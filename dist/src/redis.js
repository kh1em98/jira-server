"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const vars_1 = require("./config/vars");
const redisPort = vars_1.REDIS_PORT || '6379';
const redisHost = vars_1.REDIS_HOST || '127.0.0.1';
exports.redis = new ioredis_1.default({
    port: parseInt(redisPort, 10),
    host: redisHost,
});
//# sourceMappingURL=redis.js.map