import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUpDash,
  BookDown,
  SquarePen,
  Trash,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import type { Book, BookRender, MyRecord } from "@/lib/types";
import {
  addBook,
  deleteBook,
  getBooks,
  updateBook,
} from "@/services/books.service";
import SpinnerLoading from "@/components/SpinnerLoading";
import { getAuthorById, getAuthors } from "@/services/authors.service";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import RenderForm, { type FieldForm } from "@/components/RenderForm";
import { addBorrow, deleteBorrow, getBorrows } from "@/services/borrows.service";
import { Label } from "@/components/ui/label";

const BooksPage = () => {
  const [data, setData] = useState<BookRender[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const [books, setBooks] = useState<BookRender[]>([]);
  const [authors, setAuthors] = useState<MyRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [author, setAuthor] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [borrowerName, setBorrowerName] = useState("");

  const cols: Omit<Book, "available"> & { available: string; actions: string } =
    {
      id: "Seq",
      title: "Title",
      category: "Category",
      authorId: "Author",
      available: "Available",
      actions: "Actions",
    };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBooks();
        const booksData = res?.data ?? [];
        const finalData = await Promise.all(
          booksData.map(async (book) => {
            const author = await getAuthorById(book.authorId);
            
            return {
              ...book,
              authorId: author!,
            };
          }),
        );

        setData(finalData);

        const myAuthors = await getAuthors();
        const myCategories = Array.from(
          new Set(
            finalData.map((book) => (book.category)),
          ),
        );
        setAuthors(
          myAuthors?.data.map((auth) => ({
            label: auth.name,
            value: auth.id,
          })) ?? [],
        );
        setCategories(myCategories);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setInterval(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [update]);

  useEffect(() => {
    const visableData = data
      .filter((row) => {
        if (author === "all") return true;
        else return row.authorId.id === author;
      })
      .filter((row) => {
        if (category === "all") return true;
        else return row.category === category;
      })
      .filter((row) => {
        if (!search) {
          return true;
        } else {
          return row.title.toLowerCase().includes(search.toLowerCase());
        }
      });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(visableData);
  }, [author, category, search, data]);

  const addBookFields: FieldForm[] = [
    {
      label: "Title",
      value: title,
      onChange: setTitle,
      type: "text",
    },
    {
      label: "Category",
      value: categoryInput,
      onChange: setCategoryInput,
      type: "text",
    },
    {
      label: "Author",
      value: authorInput,
      onChange: setAuthorInput,
      type: "select",
      items: authors,
    },
  ];

  if (error)
    return <p className="text-red-500 text-xl text-center my-auto">{error}</p>;

  return (
    <div className="space-y-2">
      <PageHeader
        title="Books"
        description="Browse and manage books records with search, and filtering support."
      />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className="border rounded-md shadow p-2 space-y-3">
          <div className="flex gap-2 max-sm:flex-col">
            <Input
              name="search"
              type="search"
              className="w-[180px]"
              placeholder="search by title"
              onChange={(e) => setSearch(e.target.value)}
            />

            <Label htmlFor="author">Author:</Label>
            <Select
              id="author"
              onValueChange={(e) => setAuthor(e ?? "all")}
              defaultValue="all"
              items={authors}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {authors.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label htmlFor="category">Category:</Label>
            <Select
              id="category"
              onValueChange={(e) => setCategory(e ?? "all")}
              defaultValue="all"
              items={categories.map(cat => ({ label: cat, value: cat}))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger render={<Button className="ml-auto" />}>
                <BookDown />
                <span>Add Book</span>
              </PopoverTrigger>
              <PopoverContent>
                {/* form */}
                <RenderForm
                  title="Add Book"
                  desc="Add new book"
                  fields={addBookFields}
                  onSubmit={async () => {
                    if (title && categoryInput && authorInput) {
                      const sendData = {
                        title,
                        category: categoryInput,
                        available: true,
                        authorId: authorInput,
                      };
                      // console.log(sendData);
                      await addBook(sendData);
                      setUpdate((prev) => !prev);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />
          <Table className="">
            <TableCaption>A list of your books.</TableCaption>
            <TableHeader className="">
              <TableRow>
                {Object.values(cols).map((val) => (
                  <TableHead key={val}>{val}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {books?.map((book, i) => (
                <TableRow key={book.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.authorId.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${book.available && "bg-green-500/10 text-green-500"}`}
                      variant={book.available ? "ghost" : "destructive"}
                    >
                      {book.available ? "available" : "not available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger
                        nativeButton={false}
                        render={<SquarePen color="green" size={16} />}
                      />
                      <PopoverContent>
                        {/* form */}
                        <RenderForm
                          title="Add Book"
                          desc="Add new book"
                          fields={[
                            {
                              label: "Title",
                              value: title,
                              onChange: setTitle,
                              type: "text",
                            },
                            {
                              label: "Category",
                              value: categoryInput,
                              onChange: setCategoryInput,
                              type: "text",
                            },
                            {
                              label: "Author",
                              value: authorInput,
                              onChange: setAuthorInput,
                              type: "select",
                              items: authors,
                            },
                          ]}
                          onSubmit={async () => {
                            if (title && categoryInput && authorInput) {
                              const sendData = {
                                title,
                                category: categoryInput,
                                available: book.available,
                                authorId: authorInput,
                              };
                              // console.log(sendData);
                              await updateBook(book.id, sendData);
                              setUpdate((prev) => !prev);
                              setAuthorInput("");
                              setCategoryInput("");
                              setTitle("");
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* <SquarePen color="green" size={16} onClick={} /> */}
                    <Trash
                      color="red"
                      size={16}
                      onClick={async () => {
                        if (book.available) {
                          const borrows =
                            (await getBorrows([{ key: "bookId", value: book.id }]))
                              ?.data ?? [];

                          await Promise.all(
                            borrows.map(async (borrow) => {
                              await deleteBorrow(borrow.id);
                            }),
                          );
                          console.log(borrows)
                          await deleteBook(book.id);

                          setUpdate((prev) => !prev);
                        } else {
                          console.log("you can't delete this book");
                        }
                      }}
                    />
                    {book.available && (
                      <Popover>
                        <PopoverTrigger
                          nativeButton={false}
                          render={<ArrowBigUpDash
                        color="purple"
                        size={16} />}
                        />
                        <PopoverContent>
                          {/* form */}
                          <RenderForm
                            title="Borrow Book"
                            desc="Borrow this book"
                            fields={[
                              {
                                label: "Borrower Name",
                                value: borrowerName,
                                onChange: setBorrowerName,
                                type: "text",
                              },
                              {
                                label: "Return Date",
                                value: returnDate,
                                onChange: setReturnDate,
                                type: "date",
                              }
                            ]}
                            onSubmit={async () => {
                              if (returnDate && borrowerName) {
                                const sendData = {
                                  borrowerName,
                                  returnDate,
                                };
                                // console.log(sendData);
                                await addBorrow(book.id, sendData);
                                setUpdate((prev) => !prev);
                                setReturnDate("");
                                setBorrowerName("");
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
