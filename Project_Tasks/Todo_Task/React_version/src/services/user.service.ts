import { request } from "../utils/api.ts";
import type { ApiResponse, ErrorResponse, User } from "../utils/types.ts";

export const getUsers = async (
  filters: { key: string; value: string }[] | null = null,
): Promise<ApiResponse<User[]> | undefined> => {

  let endPoint = "users";
  if (filters) {
    endPoint += "?";
    filters.map((item) => {
      endPoint += `${item.key}=${item.value}&`;
    });
  }

  const result = await request<User[]>(endPoint);
  return result;
};

// const u = await getUsers([
//   { key: "role", value: "member" }
// ]);
// console.log(u);

export const getUserById = async (
  userId: string = "",
): Promise<User | undefined> => {
  const result = await request<User>(`users/${userId}`);
  return result?.data;
};

// const i = await getUserById("u-002");
// console.log(i);

export const addUser = async (
  user: User,
): Promise<ApiResponse<User> | ErrorResponse | undefined> => {
  const users = await getUsers();
  const checkUser = users?.data?.find((u) => u.email === user.email);
  if (checkUser) {
    return {
      status: 400,
      message: "this user already exists.",
    };
  }

  const result = await request<User, User>("users", "POST", user);

  return result;
};

// const x = await addUser({ name: "ali", email: "ali@gmail.com" });
// console.log(x);

export const deleteUser = async (
  userId: string = "",
): Promise<ApiResponse<User> | undefined> => {

  const result = await request<User>(`users/${userId}`, "DELETE");
  return result;
};
// const y = await deleteUser("1");
// console.log(y);

export const updateUser = async (
  userId: string = "",
  data: Partial<User>,
): Promise<ApiResponse<User> | undefined> => {
  const result = await request<User, Partial<User>>(
    `users/${userId}`,
    "PUT",
    data,
  );
  return result;
};
// const z = await updateUser("u-001", {
//   id: "u-001",
//   name: "Mahmoud Abulail",
//   email: "mahmoud.abulail@example.com",
//   avatarUrl: "./assests/images/patient_12.jpg",
//   role: "owner",
//   createdAt: "2025-01-10T08:00:00Z",
//   updatedAt: null,
// });
// console.log(z);
