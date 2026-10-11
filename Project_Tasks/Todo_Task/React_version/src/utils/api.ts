import type { ApiResponse, Method } from "./types";

const URL = "http://localhost:3000";

export const request = async <T = unknown, D = unknown>(
  endPoint: string = "",
  method: Method = "GET",
  data: D | null = null,
): Promise<ApiResponse<T> | undefined> => {
  try {
    const res = await fetch(`${URL}/${endPoint}`, {
      method: method,
      headers: {
        "Content-type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!res.ok) {
      throw new Error(
        res.status == 404
          ? "not found."
          : res.status == 400
            ? "bad request."
            : res.status == 403
              ? "access denied."
              : res.status == 500
                ? "server error."
                : "something went wrong.",
      );
    }

    const result = (await res.json()) as T;
    return { status: res.status, data: result, message: "done successfully." };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
};

// const users = await request("users");
// console.log(users);
