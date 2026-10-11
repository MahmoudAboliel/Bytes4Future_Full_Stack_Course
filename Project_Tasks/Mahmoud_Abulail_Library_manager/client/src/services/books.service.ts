import { routes } from "../lib/constances.ts";
import { request } from "./api.ts";
import type { ApiResponse, ErrorResponse, Book } from "@/lib/types.ts";

type Filter = {
  key: string;
  value: string | number;
};
export const getBooks = async (
  filters: Filter[] | null = null,
): Promise<ApiResponse<Book[]> | undefined> => {
  let endPoint = routes.books;
  if (filters) {
    endPoint += "?";
    filters.map((item) => {
      endPoint += `${item.key}=${item.value}&`;
    });
  }

  const result = await request<Book[]>(endPoint);
  return result;
};

// const u = await getBooks([
//   {
//     key: "nationality",
//     value: "Japanese",
//   },
// ]);
// console.log(u);

export const getBookById = async (
  bookId: string,
): Promise<Book | undefined> => {
  const result = await request<Book>(`${routes.books}/${bookId}`);
  return result?.data;
};

// const i = await getBookById("2");
// console.log(i);

type AddBook = Omit<Book, "id">;
export const addBook = async (
  book: AddBook,
): Promise<ApiResponse<Book> | ErrorResponse | undefined> => {
  const result = await request<Book, AddBook>(routes.books, "POST", book);

  return result;
};

// const x = await addBook({
//   title: "What next",
//   authorId: "Ai0mUhSRjSY",
//   category: "Life",
//   available: true
// });
// console.log(x);

export const deleteBook = async (
  bookId: string,
): Promise<ApiResponse<Book> | undefined> => {
  const result = await request<Book>(`${routes.books}/${bookId}`, "DELETE");
  return result;
};
// const y = await deleteBook("1ufd6Wh5tZw");
// console.log(y);

export const updateBook = async (
  bookId: string,
  data: Partial<Book>,
): Promise<ApiResponse<Book> | undefined> => {
  const result = await request<Book, Partial<Book>>(
    `${routes.books}/${bookId}`,
    "PUT",
    data,
  );
  return result;
};

// const z = await updateBook("1", {
//   id: "1",
//   title: "Pride and Prejudice",
//   authorId: "1",
//   category: "Classic",
//   available: true,
// });
// console.log(z);
