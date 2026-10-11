import type { Dispatch, SetStateAction } from "react";
import type {
  Method,
  ApiResponse,
  User,
  Post,
  Comment,
  Album,
  Photo,
  Todo,
} from "@/lib/types";
import { URL } from "@/lib/constants";

const normalizeIdValues = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeIdValues(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => {
        const shouldNormalizeId =
          key === "id" ||
          key.toLowerCase() === "userid" ||
          key.toLowerCase().endsWith("id");

        if (shouldNormalizeId && item !== null && item !== undefined) {
          return [key, String(item)];
        }

        return [key, normalizeIdValues(item)];
      }),
    ) as T;
  }

  return value;
};

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
          ? "not found"
          : res.status == 400
            ? "bad request"
            : res.status == 403
              ? "access denied"
              : res.status == 500
                ? "server error"
                : "something went wrong",
      );
    }

    const result = normalizeIdValues((await res.json()) as T);
    return { status: res.status, data: result, message: "done successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
};

const createCrudService = <
  TEntity extends { id: string },
  TCreate = Omit<TEntity, "id">,
  TUpdate = Partial<TCreate>,
>(
  endPoint: string,
) => ({
  getAll: (query: string = "") => request<TEntity[]>(`${endPoint}${query}`),
  getById: (id: string, query: string = "") =>
    request<TEntity>(`${endPoint}/${id}${query}`),
  create: (data: TCreate | null) =>
    request<TEntity, TCreate>(endPoint, "POST", data),
  update: (id: string, data: TUpdate | null) =>
    request<TEntity, TUpdate>(`${endPoint}/${id}`, "PATCH", data),
  delete: (id: string, query: string = "") =>
    request<null>(`${endPoint}/${id}${query}`, "DELETE"),
});

export const usersApi = createCrudService<User>("users");
export const postsApi = createCrudService<Post>("posts");
export const commentsApi = createCrudService<Comment>("comments");
export const albumsApi = createCrudService<Album>("albums");
export const photosApi = createCrudService<Photo>("photos");
export const todosApi = createCrudService<Todo>("todos");

// TODO query parameters
// const x = async () => {
//   const res = await fetch("http://localhost:3000/users?id=2");
//   const rr = await res.json();
//   console.log(rr);
// };

// For Types
// const xx = await usersApi.getAll();
// console.log(xx?.data[0]);

export const deletePostWithComments = async (postId: string) => {
  const comments = await commentsApi.getAll(`?postId=${postId}`);
  const commentIds = comments?.data.map((c) => c.id) ?? [];

  await Promise.all(
    commentIds.map(async (id) => {
      await commentsApi.delete(id);
    }),
  );

  await postsApi.delete(postId);
};

export const deleteAlbumWithPhotos = async (albumId: string) => {
  const photos = await photosApi.getAll(`?albumId=${albumId}`);
  const commentIds = photos?.data.map((ph) => ph.id) ?? [];
  await Promise.all(
    commentIds.map(async (id) => {
      await photosApi.delete(id);
    }),
  );

  await albumsApi.delete(albumId);
};

export const sendComment = async (
  user: User,
  post: Post,
  message: string,
  setMessage: Dispatch<SetStateAction<string>>,
  setUpdate: Dispatch<SetStateAction<boolean>>,
) => {
  const payload: Omit<Comment, "id"> = {
    name: user.username,
    body: message,
    email: user.email,
    postId: post.id,
  };
  await commentsApi.create(payload);
  setUpdate((prev) => !prev);
  setMessage("");
};
