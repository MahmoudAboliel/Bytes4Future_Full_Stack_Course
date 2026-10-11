import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table/Table";
import TableBody from "@/components/Table/TableBody/TableBody";
import TableCell from "@/components/Table/TableCell/TableCell";
import TableHead from "@/components/Table/TableHead/TableHead";
import TableRow from "@/components/Table/TableRow/TableRow";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/constants";
import type { ColumnConfig, Post } from "@/lib/types";
import { extractHeaders } from "@/lib/utils";
import { postsApi } from "@/services/api";

import { useEffect, useState } from "react";
import { Link } from "react-router";

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await postsApi.getAll();
      setPosts(response?.data.reverse() || []);
    };

    fetchPosts();
  }, []);
  // console.log(posts);

  const postColumns: ColumnConfig<Post>[] = [
    { header: "No.#", key: "id" },
    { header: "Title", key: "title" },
    { header: "Body", key: "body" },
  ];

  const headers = [...extractHeaders(postColumns), "Actions"];
  return (
    <div>
      <PageHeader {...pageMeta.allPosts} AddButton={<></>} />
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
                {/* <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => handleUpdate(post.id)}
                >
                  Update
                </Button>
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllPosts;
