import { getUserById } from "@/services/user.service.ts";
import type { Task, TaskDTO, User } from "./types.ts";

export const initializeTask = async (task: TaskDTO): Promise<Task> => {
  const creator = (await getUserById(task.creatorId)) as unknown as User;
  if (!creator) throw new Error("some thing went wrong");
  const assigneeUsers = [];
  for (const i in task.assigneeIds) {
    const init = (await getUserById(task.assigneeIds[i])) as unknown as User;
    if (!init) throw new Error("some thing went wrong");
    assigneeUsers.push({ ...init, avatarUrl: init.avatarUrl?.slice(1) });
  }

  return {
    ...task,
    creatorId: { ...creator, avatarUrl: creator.avatarUrl?.slice(1) },
    assigneeIds: assigneeUsers,
  };
};
