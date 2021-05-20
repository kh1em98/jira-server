"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const type_graphql_1 = require("type-graphql");
const User_1 = require("../../entity/User");
const Task_1 = require("../../entity/Task");
const createTaskInput_1 = require("./createTaskInput");
const isAuth_middleware_1 = require("../../middlewares/isAuth.middleware");
let TaskResolver = class TaskResolver {
    createTask({ title, description }, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield Task_1.Task.create({
                title,
                description,
                userId: ctx.req.session.userId,
            }).save();
            return task;
        });
    }
    user(task, { userLoader }) {
        return userLoader.load(task.userId);
    }
    getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield Task_1.Task.find({});
            return tasks;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Task_1.Task),
    type_graphql_1.UseMiddleware(isAuth_middleware_1.isAuth, isAuth_middleware_1.isVerified),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createTaskInput_1.CreateTaskInput, Object]),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "createTask", null);
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Task_1.Task, Object]),
    __metadata("design:returntype", void 0)
], TaskResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => [Task_1.Task]),
    type_graphql_1.UseMiddleware(isAuth_middleware_1.isAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskResolver.prototype, "getAllTasks", null);
TaskResolver = __decorate([
    type_graphql_1.Resolver(Task_1.Task)
], TaskResolver);
exports.default = TaskResolver;
//# sourceMappingURL=task.resolver.js.map