import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table/Table";
import TableBody from "@/components/Table/TableBody/TableBody";
import TableCell from "@/components/Table/TableCell/TableCell";
import TableHead from "@/components/Table/TableHead/TableHead";
import TableRow from "@/components/Table/TableRow/TableRow";
import { useUser } from "@/context/UserContext";
import { pageMeta } from "@/lib/constants";
import type { ColumnConfig, Post } from "@/lib/types";
import { extractHeaders } from "@/lib/utils";
import { deletePostWithComments } from "@/services/api";
import { postsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { DynamicForm } from "@/lib/dynamic-form/DynamicForm";
import { MessageCircle } from "lucide-react";
import CustomDialog, { type CustomDialogRef } from "@/components/CustomDialog";

const MyPosts = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        const response = await postsApi.getAll(`?userId=${user.id}`);
        setPosts(response?.data.reverse() || []);
      }
    };

    fetchPosts();
  }, [user, update]);
  console.log(posts);

  const postColumns: ColumnConfig<Post>[] = [
    { header: "No.#", key: "id" },
    { header: "Title", key: "title" },
    { header: "Body", key: "body" },
  ];

  const headers = [...extractHeaders(postColumns), "Actions"];

  const ref = useRef<CustomDialogRef>(null);

  return (
    <div>
      <PageHeader
        {...pageMeta.myPosts}
        AddButton={
          <CustomDialog
            Trigger={
              <Button size="sm" variant="default">
                <MessageCircle />
                Add Post
              </Button>
            }
            dialogTitle="Add Post"
            dialogDesc="Add your post"
            ref={ref}
          >
            <DynamicForm
              fields={[
                {
                  name: "title",
                  label: "Post Title",
                  type: "text",
                  required: true,
                },
                {
                  name: "body",
                  label: "Post Body",
                  type: "textarea",
                  rows: 4,
                  required: true,
                },
              ]}
              onSubmit={async (data: Record<string, unknown>) => {
                if (user) {
                  const payload: Omit<Post, "id"> = {
                    title: (data.title as string) ?? "",
                    body: (data.body as string) ?? "",
                    userId: user.id,
                  };
                  await postsApi.create(payload);
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
          {posts.map((post, index) => (
            <TableRow key={post.id}>
              {postColumns.map((col) => (
                <TableCell key={col.key} id={String(col.key)}>
                  {col.key === "id" ? index + 1 : String(post[col.key])}
                </TableCell>
              ))}
              <TableCell id="actions" className="flex items-center gap-2">
                <Button size="xs" variant="outline">
                  <Link to={`/posts/${post.id}`}>View</Link>
                </Button>
                <CustomDialog
                  Trigger={
                    <Button size="xs" variant="secondary">
                      update
                    </Button>
                  }
                  dialogTitle="Update Post"
                  dialogDesc="Edit your post"
                  ref={ref}
                >
                  <DynamicForm
                    fields={[
                      {
                        name: "title",
                        label: "Post Title",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "body",
                        label: "Post Body",
                        type: "textarea",
                        rows: 4,
                        required: false,
                      },
                    ]}
                    defaultValues={{ title: post.title, body: post.body }}
                    onSubmit={async (data: Record<string, unknown>) => {
                      await postsApi.update(post.id, data);
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
                    await deletePostWithComments(post.id);
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

export default MyPosts;
