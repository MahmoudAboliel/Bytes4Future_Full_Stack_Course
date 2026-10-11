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
import { Button } from "@/components/ui/button";
import {
  BookDown,
  SquarePen
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import type { Author } from "@/lib/types";
import SpinnerLoading from "@/components/SpinnerLoading";
import { addAutor, getAuthors, updateAuthor } from "@/services/authors.service";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RenderForm, { type FieldForm } from "@/components/RenderForm";

const AuthorsPage = () => {
  const [data, setData] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);
  
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");

  
  const cols: Author & { actions: string } =
    {
      id: "Seq",
      name: "Name",
      nationality: "Category",
      actions: "Actions"
    };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAuthors();
        const authorsData = res?.data ?? [];
        
        setData(authorsData);

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
        if (!search) {
          return true;
        } else {
          return row.name.toLowerCase().includes(search.toLowerCase());
        }
      });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthors(visableData);
  }, [search, data]);

  const addAuthorFields: FieldForm[] = [
    {
      label: "Name",
      value: name,
      onChange: setName,
      type: "text",
    },
    {
      label: "Nationality",
      value: nationality,
      onChange: setNationality,
      type: "text",
    },
  ];

  if (error)
    return <p className="text-red-500 text-xl text-center my-auto">{error}</p>;

  return (
    <div className="space-y-2">
      <PageHeader
        title="Authors"
        description="Browse and manage author records with search support."
      />
      {loading ? (
        <SpinnerLoading />
      ) : (
        <div className="border rounded-md shadow p-2 space-y-3">
          <div className="flex justify-between gap-2 max-sm:flex-col">
            <Input
              name="search"
              type="search"
              className="w-[180px]"
              placeholder="search by name"
              onChange={(e) => setSearch(e.target.value)}
            />

            <Popover>
              <PopoverTrigger render={<Button className="w-fit" />}>
                <BookDown />
                <span>Add Author</span>
              </PopoverTrigger>
              <PopoverContent>
                {/* form */}
                <RenderForm
                  title="Add Author"
                  desc="Add new author"
                  fields={addAuthorFields}
                  onSubmit={async () => {
                    if (name && nationality) {
                      const sendData = {
                        name,
                        nationality,
                      };
                      // console.log(sendData);
                      await addAutor(sendData);
                      setUpdate((prev) => !prev);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Separator />
          <Table className="">
            <TableCaption>A list of authors.</TableCaption>
            <TableHeader className="">
              <TableRow>
                {Object.values(cols).map((val) => (
                  <TableHead key={val}>{val}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.length === 0 
              ? (<TableRow className="">there is no data</TableRow>) 
              : authors?.map((auth, i) => (
                <TableRow key={auth.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{auth.name}</TableCell>
                  <TableCell>{auth.nationality}</TableCell>
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
                              label: "Name",
                              value: name,
                              onChange: setName,
                              type: "text",
                            },
                            {
                              label: "Nationality",
                              value: nationality,
                              onChange: setNationality,
                              type: "text",
                            }
                          ]}
                          onSubmit={async () => {
                            if (name && nationality) {
                              const sendData = {
                                name,
                                nationality
                              };
                              // console.log(sendData);
                              await updateAuthor(auth.id, sendData);
                              setUpdate((prev) => !prev);
                              setName("");
                              setNationality("");
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AuthorsPage;
