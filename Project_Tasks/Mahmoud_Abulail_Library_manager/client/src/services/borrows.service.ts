import { request } from "./api.ts";
import { routes } from "../lib/constances.ts";
import type { ApiResponse, ErrorResponse, Borrow } from "@/lib/types.ts";
import { getBookById, updateBook } from "./books.service.ts";

type Filter = {
  key: string;
  value: string | number;
};
export const getBorrows = async (
  filters: Filter[] | null = null,
): Promise<ApiResponse<Borrow[]> | undefined> => {
  let endPoint = routes.borrows;
  if (filters) {
    endPoint += "?";
    filters.map((item) => {
      endPoint += `${item.key}=${item.value}&`;
    });
  }

  const result = await request<Borrow[]>(endPoint);
  return result;
};

// const u =
//   await getBorrows();
// [
//   {
//     key: "nationality",
//     value: "Japanese",
//   },
// ]
// console.log(u);

export const getBorrowById = async (
  borrowId: string,
): Promise<Borrow | undefined> => {
  const result = await request<Borrow>(`${routes.borrows}/${borrowId}`);
  return result?.data;
};

// const i = await getBorrowById("2");
// console.log(i);

type AddBorrow = Pick<Borrow, "borrowerName" | "returnDate">;
export const addBorrow = async (
  bookId: string,
  borrow: AddBorrow,
): Promise<ApiResponse<Borrow> | ErrorResponse | undefined> => {
  const checkBook = await getBookById(bookId);
  if (!checkBook?.available)
    return { message: "this book not available.", status: 403 };

  await updateBook(bookId, { ...checkBook!, available: false });

  const result = await request<Borrow, Omit<Borrow, "id">>(
    routes.borrows,
    "POST",
    {
      ...borrow,
      borrowDate: new Date(),
      bookId,
    },
  );

  return result;
};

// const x = await addBorrow("3", {
//   borrowerName: "Sara Alahmad",
//   returnDate: "2026-10-1",
// });
// console.log(x);

export const deleteBorrow = async (
  borrowId: string,
): Promise<ApiResponse<Borrow> | ErrorResponse | undefined> => {
  const result = await request<Borrow>(
    `${routes.borrows}/${borrowId}`,
    "DELETE",
  );

  if (result) {
      const book = await getBookById(result.data.bookId);
      if (!book?.available) await updateBook(result.data.bookId, { ...book, available: true });

      return result;
  }

  return { message: "something wrong.", status: 400 }

};
// const y = await deleteBorrow("PtCEJsdgoX8");
// console.log(y);

export const updateBorrow = async (
  borrowId: string,
  data: Partial<Borrow>,
): Promise<ApiResponse<Borrow> | undefined> => {
  const result = await request<Borrow, Partial<Borrow>>(
    `${routes.borrows}/${borrowId}`,
    "PUT",
    data,
  );
  return result;
};

// const z = await updateBorrow("NVB6zfsv1Jw", {
//   bookId: "1ufd6Wh5tZw",
//   borrowDate: "2026-09-27T09:52:26.541Z",
//   borrowerName: "Jak Jone",
//   returnDate: "2026-10-1",
//   id: "NVB6zfsv1Jw",
// });
// console.log(z);
