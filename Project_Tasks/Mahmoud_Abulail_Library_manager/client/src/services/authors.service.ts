import { request } from "./api.ts";
import { routes } from "../lib/constances.ts";
import type { ApiResponse, ErrorResponse, Author } from "@/lib/types.ts";

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};
type Filter = {
  key: string;
  value: string | number;
};
export const getAuthors = async (
  pagination: PaginationState | null = null,
  filters: Filter[] | null = null,
): Promise<ApiResponse<Author[]> | undefined> => {
  let endPoint = routes.authors;
  if (pagination) {
    endPoint += "?";
    endPoint += `_page=${pagination.pageIndex}&_limit=${pagination.pageSize}`;
  }

  else if (filters) {
    endPoint += "?";
    filters.map((item) => {
      endPoint += `${item.key}=${item.value}&`;
    });
  }

  const result = await request<Author[]>(endPoint);
  return result;
};

// const u = await getAuthors([
//   {
//     key: "nationality",
//     value: "Japanese",
//   },
// ]);
// console.log(u);

export const getAuthorById = async (
  userId: string,
): Promise<Author | undefined> => {
  const result = await request<Author>(`${routes.authors}/${userId}`);
  return result?.data;
};

// const i = await getAuthorById("2");
// console.log(i);

type AddAuthor = Omit<Author, "id">;
export const addAutor = async (
  author: AddAuthor,
): Promise<ApiResponse<Author> | ErrorResponse | undefined> => {
  const result = await request<Author, AddAuthor>(
    routes.authors,
    "POST",
    author,
  );

  return result;
};

// const x = await addAutor({ name: "Mahmoud Abulail", nationality: "Syrian" });
// console.log(x);

export const deleteAuthor = async (
  authorId: string,
): Promise<ApiResponse<Author> | undefined> => {
  const result = await request<Author>(
    `${routes.authors}/${authorId}`,
    "DELETE",
  );
  return result;
};
// const y = await deleteAuthor("1");
// console.log(y);

export const updateAuthor = async (
  authorId: string,
  data: Partial<Author>,
): Promise<ApiResponse<Author> | undefined> => {
  const result = await request<Author, Partial<Author>>(
    `${routes.authors}/${authorId}`,
    "PUT",
    data,
  );
  return result;
};

// const z = await updateAuthor("1", {
//   name: "Ali Mohamad",
//   nationality: "Eygpt",
// });
// console.log(z);
