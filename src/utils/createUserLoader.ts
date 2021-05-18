import DataLoader from 'dataloader';

import { User } from '../entity/User';

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]

const batchLoadUser = async (userIds) => {
  const users = await User.findByIds(userIds as number[]);

  const userIdToUser: Record<number, User> = {};

  users.forEach((user) => {
    userIdToUser[user.id] = user;
  });

  const sortedUsers = userIds.map((id) => userIdToUser[id]);

  return sortedUsers;
};

export const createUserLoader = () =>
  new DataLoader<number, User>(batchLoadUser);
