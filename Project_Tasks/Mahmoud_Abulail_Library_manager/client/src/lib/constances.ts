import { LayoutDashboard, UserRoundPen, Library, LayersMinus } from "lucide-react";
import DashboardPage from "@/pages/DashboardPage";
import AuthorsPage from "@/pages/AuthorsPage";
import BooksPage from "@/pages/BooksPage";
import BorrowsPage from "@/pages/BorrowsPage";

export const URL = "http://localhost:3000";

export const routes = {
  authors: "authors",
  books: "books",
  borrows: "borrows",
};

export const pages = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    element: DashboardPage,
  },
  {
    label: "Authors",
    href: "authors",
    icon: UserRoundPen,
    element: AuthorsPage,
  },
  {
    label: "Books",
    href: "books",
    icon: Library,
    element: BooksPage,
  },
  {
    label: "Borrows",
    href: "borrows",
    icon: LayersMinus,
    element: BorrowsPage,
  },
];