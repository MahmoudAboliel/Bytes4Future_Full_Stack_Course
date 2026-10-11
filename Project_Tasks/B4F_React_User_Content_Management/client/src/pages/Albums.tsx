import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table/Table";
import TableBody from "@/components/Table/TableBody/TableBody";
import TableCell from "@/components/Table/TableCell/TableCell";
import TableHead from "@/components/Table/TableHead/TableHead";
import TableRow from "@/components/Table/TableRow/TableRow";
import { useUser } from "@/context/UserContext";
import { pageMeta } from "@/lib/constants";
import type { Album, ColumnConfig } from "@/lib/types";
import { albumsApi, deleteAlbumWithPhotos } from "@/services/api";
import { Button } from "@/components/ui/button";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { extractHeaders } from "@/lib/utils";
import { DynamicForm } from "@/lib/dynamic-form/DynamicForm";
import { Images } from "lucide-react";
import CustomDialog, { type CustomDialogRef } from "@/components/CustomDialog";

const MyAlbums = () => {
  const { user } = useUser();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (user) {
        const response = await albumsApi.getAll(`?userId=${user.id}`);
        setAlbums(response?.data.reverse() || []);
      }
    };

    fetchAlbums();
  }, [user, update]);
  // console.log(albums);

  const albumColumns: ColumnConfig<Album>[] = [
    { header: "No.#", key: "id" },
    { header: "Title", key: "title" },
  ];

  const headers = [...extractHeaders(albumColumns), "Actions"];

  const ref = useRef<CustomDialogRef>(null);
  
  return (
    <div>
      <PageHeader
        {...pageMeta.albums}
        AddButton={
          <CustomDialog
            Trigger={
              <Button size="sm" variant="default">
                <Images />
                Add Album
              </Button>
            }
            dialogTitle="Add Album"
            dialogDesc="Add your Album"
            ref={ref}
          >
            <DynamicForm
              fields={[
                {
                  name: "title",
                  label: "Album Title",
                  type: "text",
                  required: true,
                },
              ]}
              onSubmit={async (data: Record<string, unknown>) => {
                if (user) {
                  const payload: Omit<Album, "id"> = {
                    title: (data.title as string) ?? "",
                    userId: user.id,
                  };
                  await albumsApi.create(payload);
                  setUpdate((prev) => !prev);
                  ref.current?.close();
                }
              }}
              submitLabel="Add"
              columns={1}
            />
          </CustomDialog>
        }
      />
      <Table id="table">
        <TableHead cols={headers} />
        <TableBody id="table-body">
          {albums.map((album, index) => (
            <TableRow key={album.id}>
              {albumColumns.map((col) => (
                <TableCell key={col.key} id={String(col.key)}>
                  {col.key === "id" ? index + 1 : String(album[col.key])}
                </TableCell>
              ))}
              <TableCell id="actions" className="flex items-center gap-2">
                <Button size="xs" variant="outline">
                  <Link to={`/albums/${album.id}/photos`}>View</Link>
                </Button>
                <CustomDialog
                  Trigger={
                    <Button size="xs" variant="secondary">
                      update
                    </Button>
                  }
                  dialogTitle="Update Album"
                  dialogDesc="Edit your album"
                  ref={ref}
                >
                  <DynamicForm
                    fields={[
                      {
                        name: "title",
                        label: "Album Title",
                        type: "textarea",
                        rows: 4,
                        required: false,
                      },
                    ]}
                    defaultValues={{ title: album.title }}
                    onSubmit={async (data: Record<string, unknown>) => {
                      await albumsApi.update(album.id, data);
                      setUpdate((prev) => !prev);
                      ref.current?.close();
                    }}
                    submitLabel="edit"
                    columns={1}
                  />
                </CustomDialog>
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={async () => {
                    await deleteAlbumWithPhotos(album.id);
                    setUpdate((prev) => !prev);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyAlbums;
