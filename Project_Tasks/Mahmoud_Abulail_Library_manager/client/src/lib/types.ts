export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  category: string;
  available: boolean;
}
export interface BookRender {
  id: string;
  title: string;
  authorId: Author;
  category: string;
  available: boolean;
}

export interface Borrow {
  id: string;
  bookId: string;
  borrowerName: string;
  borrowDate: string | Date;
  returnDate: string | Date;
}

export interface BorrowRender {
  id: string;
  bookId: Book;
  borrowerName: string;
  borrowDate: string | Date;
  returnDate: string | Date;
}

// export interface LibraryData {
//   authors: Author[];
//   books: Book[];
//   borrows: Borrow[];
// }

export type MyRecord = { label: string; value: string };

export type Status = "safe" | "due" | "late";