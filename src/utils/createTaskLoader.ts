import DataLoader from 'dataloader';

import { Task } from '../entity/Task';

const batchLoadTask = async (taskIds) => {
  const tasks = await Task.findByIds(taskIds as number[]);

  const taskIdToTask: Record<number, Task> = {};

  tasks.forEach((task) => {
    taskIdToTask[task.id] = task;
  });

  const sortedTasks = taskIds.map((id) => taskIdToTask[id]);

  return sortedTasks;
};

export const createTaskLoader = () =>
  new DataLoader<number, Task>(batchLoadTask);
