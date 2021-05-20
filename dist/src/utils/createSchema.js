"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const type_graphql_1 = require("type-graphql");
const createSchema = () => {
    return type_graphql_1.buildSchema({
        resolvers: [__dirname + '/../resolvers/**/*.resolver.ts'],
        authChecker: ({ context: { req } }) => {
            if (!req.session.userId) {
                return false;
            }
            return true;
        },
    });
};
exports.createSchema = createSchema;
//# sourceMappingURL=createSchema.js.map