import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { Task } from '../entity/Task';
import { RegisterInput } from '../resolvers/user/register/RegisterInput';
import { getRepository } from 'typeorm';
import { Role, User } from '../entity/User';
import { EmailExistedError } from '../resolvers/user/register/Register.resolver';
import { isAdmin } from './User';

enum CursorType {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

const deserializeCursor = (cursor: string): string[] => {
  return cursor.split('__');
};

export const generateTaskModel = (currentUser: User | undefined) => ({
  getAll: async (take: number, cursor: string) => {
    if (!currentUser) {
      return [];
    }

    const realLimit = take ? take + 1 : 10;

    // Check if has more tasks
    const realLimitPlusOne = realLimit + 1;

    const query = getRepository(Task)
      .createQueryBuilder('task')
      .take(realLimitPlusOne);

    if (cursor) {
      const [type, payload] = deserializeCursor(cursor);

      if (type === CursorType.PREVIOUS) {
        query
          .where(`task."createdAt" < :payload`)
          .orderBy('task."createdAt"', 'DESC');
      } else if (type === CursorType.NEXT) {
        query
          .where(`task."createdAt" > :payload`)
          .orderBy('task."createdAt"', 'ASC');
      } else {
        throw new Error('Invalid cursor');
      }

      query.setParameters({ payload: new Date(parseInt(payload)) });
    }

    const tasks = await query.getMany();
    return {
      tasks: tasks.slice(0, realLimit),
      hasMore: tasks.length === realLimitPlusOne,
    };
  },
  getById: async (id: number) => {
    try {
      return await Task.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  create: async ({ title, description }) => {
    try {
      const task = await Task.create({
        title,
        description,
        userId: currentUser?.id,
      }).save();

      return task;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteById: async (id: number) => {
    try {
      await Task.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  },
});
