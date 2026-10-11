import { request } from "../utils/api.ts";
import type { ApiResponse, TaskDTO } from "../utils/types.ts";

export const getTasks = async (
  filters: { key: string; value: string }[] | null = null,
): Promise<ApiResponse<TaskDTO[]> | undefined> => {

  let endPoint = "tasks";
  if (filters) {
    endPoint += "?";
    filters.map((item) => {
      endPoint += `${item.key}=${item.value}&`;
    });
  }

  const result = await request<TaskDTO[]>(endPoint);
  return result;
};

// const t = await getTasks([{ key: "status", value: "in_progress" }]);
// console.log(t);

export const addTask = async (
  task: TaskDTO,
): Promise<ApiResponse<TaskDTO> | undefined> => {
  const result = await request<TaskDTO, TaskDTO>("tasks", "POST", task);
  return result;
};

// const x = await addTask({title: "one"});
// console.log(x);

export const deleteTask = async (
  taskId: string = "",
): Promise<ApiResponse<TaskDTO> | undefined> => {
  const result = await request<TaskDTO>(`tasks/${taskId}`, "DELETE");
  return result;
};

// const y = await deleteTask("YDHws_bzdLk");
// console.log(y);

export const updateTask = async (
  taskId: string = "",
  data: TaskDTO,
): Promise<ApiResponse<TaskDTO> | undefined> => {
  const result = await request<TaskDTO, TaskDTO>(
    `tasks/${taskId}`,
    "PUT",
    data,
  );
  return result;
};

// const z = await updateTask("YDHws_bzdLk", { title: "two" });
// console.log(z);
