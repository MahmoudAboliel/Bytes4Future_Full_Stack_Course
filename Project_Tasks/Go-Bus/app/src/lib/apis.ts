import { ImperativeRouter } from "expo-router";
import { LoginUser, Method, RegisterUser, Trip, UserRes } from "./types";

export const url = "http://192.168.169.180:5000/api";

export const request = async <T = unknown, D = unknown>(
  url: string,
  method: Method = "GET",
  data: undefined | D = undefined,
  fullRes: boolean = false,
  token?: string,
): Promise<T> => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });
  if (!response.ok) {
    alert(response.text);
    throw new Error(`Error: ${response}`);
  }

  if (fullRes) return response.json();

  const resut = await response.json();
  return resut.data;
};

const createCrudServices = <
  TEntity,
  TCreate = Omit<TEntity, "_id" | "id">,
  TUpdate = Partial<TCreate>,
>(
  endPoint: string,
) => ({
  getAll: (query?: string) =>
    request<TEntity[]>(`${url}/${endPoint}${query ? query : ""}`),
  getById: (id: string) => request<TEntity>(`${url}/${endPoint}/${id}`),
  create: (data: TCreate, query?: string) =>
    request<TEntity, TCreate>(
      `${url}/${endPoint}${query ? query : ""}`,
      "POST",
      data,
    ),
  update: (id: string, data: TUpdate) =>
    request<TEntity, TUpdate>(`${url}/${endPoint}/${id}`, "PUT", data),
  delete: (id: string, query?: string) =>
    request<null>(`${url}/${endPoint}/${id}${query ? query : ""}`, "DELETE"),
});

export const tripsApi = createCrudServices<Trip>("trips");
export const userApi = {
  register: (data: RegisterUser) =>
    request<UserRes, RegisterUser>(`${url}/auth/register`, "POST", data, true),
  login: (data: LoginUser) =>
    request<UserRes, LoginUser>(`${url}/auth/login`, "POST", data, true),
};

export const submitBooking = (
  tripId: string,
  selectedSeats: number[],
  router: ImperativeRouter,
  token?: string | null,
) => {
  if (!token) {
    alert("يرجى تسجيل الدخول أولاً");
    router.push("/login");
    return;
  }
  if (selectedSeats.length === 0) {
    alert("يرجى اختيار مقعد واحد على الأقل من اللوحة");
    return;
  }
  return request(
    `${url}/bookings`,
    "POST",
    { tripId, seatNumbers: selectedSeats },
    true,
    token,
  );
};
