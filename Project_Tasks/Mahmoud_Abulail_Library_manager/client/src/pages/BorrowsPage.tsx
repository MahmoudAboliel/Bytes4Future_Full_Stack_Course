import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/PageHeader";
import type { Borrow, BorrowRender } from "@/lib/types";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { deleteBorrow, getBorrows } from "@/services/borrows.service";
import { getBookById } from "@/services/books.service";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { getDateStatus } from "@/lib/utils";

const BorrowsPage = () => {
  const [data, setData] = useState<BorrowRender[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const [borrows, setBorrows] = useState<BorrowRender[]>([]);

  const [search, setSearch] = useState("");
  const today = new Date();

  const cols: Borrow & { actions: string } = {
    id: "Seq",
    borrowerName: "Borrower Name",
    bookId: "Book Name",
    borrowDate: "Borrow Date",
    returnDate: "Return Date",
    actions: "Actions",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBorrows();
        const borrowsData = res?.data ?? [];
        const finalData = await Promise.all(
          borrowsData.map(async (borrow) => {
            const book = await getBookById(borrow.bookId);

            return {
              ...borrow,
              bookId: book ?? {
                id: "--",
                authorId: "--",
                title: "--",
                available: false,
                category: "--",
              },
            };
          }),
        );
        setData(finalData);
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
    const visableData = data.filter((row) => {
      if (!search) {
        return true;
      } else {
        return row.borrowerName.toLowerCase().includes(search.toLowerCase());
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBorrows(visableData);
  }, [search, data]);

  if (error)
    return <p className="text-red-500 text-xl text-center my-auto">{error}</p>;

  return (
    <div className="space-y-2">
      <PageHeader
        title="Borrows"
        description="Browse and manage Borrows records with search support."
      />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className="border rounded-md shadow p-2 space-y-3">
          <div className="flex gap-4 max-sm:flex-col">
            <Input
              name="search"
              type="search"
              className="w-[180px]"
              placeholder="search by name"
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <Separator />
          <Table className="">
            <TableCaption>A list of borrows.</TableCaption>
            <TableHeader className="">
              <TableRow>
                {Object.values(cols).map((val) => (
                  <TableHead key={val}>{val}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrows?.map((borrow, i) => {
                const status = getDateStatus(borrow.returnDate);
                console.log(status)
                return (
                  <TableRow key={borrow.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{borrow.borrowerName}</TableCell>
                    <TableCell>{borrow.bookId.title}</TableCell>
                    <TableCell>
                      {new Date(borrow.borrowDate).toDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${status === "safe" ? "bg-green-500/10 text-green-600" : status === "due" ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"}`}
                      >
                        {new Date(borrow.returnDate).toDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Trash
                        size={16}
                        color="red"
                        onClick={async () => {
                          await deleteBorrow(borrow.id);
                          setUpdate((prev) => !prev);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BorrowsPage;
