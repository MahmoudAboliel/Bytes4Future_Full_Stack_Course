import CommentMessage from "@/components/CommentMessage";
// import PageHeader from "@/components/PageHeader";
import PostCard from "@/components/PostCard";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
// import { pageMeta } from "@/lib/constants";
import type { Post, Comment, User } from "@/lib/types";
import { postsApi, commentsApi, usersApi, sendComment } from "@/services/api";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const PostDetails = () => {
  const { user } = useUser();
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [userPost, setUserPost] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      const postResponse = await postsApi.getById(postId);
      setPost(postResponse?.data || null);
      if (postResponse?.data.userId) {
        const userResponse = await usersApi.getById(postResponse?.data.userId);
        setUserPost(userResponse?.data || null);
      }

      const commentsResponse = await commentsApi.getAll(`?postId=${postId}`);
      setComments(commentsResponse?.data.reverse() || []);
    };

    if (postId) {
      fetchPost(postId);
    }
  }, [postId, user, update]);
  console.log(post);
  console.log(comments);
  return (
    <>
      {/* <PageHeader {...pageMeta.postDetails} AddButton={<></>} /> */}
      <PostCard post={post!} userPost={userPost!} />
      <Field
        orientation="horizontal"
        className="items-center mt-3 gap-2 relative"
      >
        <Textarea
          className="border shadow"
          rows={2}
          placeholder="What you think..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={async (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && e.shiftKey && user && post && message) {
              e.preventDefault();
              await sendComment(
                user,
                post,
                message.trim(),
                setMessage,
                setUpdate,
              );
            }
          }}
        />
        <Send
          className="absolute right-2 top-2 cursor-pointer hover:text-red-300"
          size={21}
          color="#03a9f4"
          onClick={async () => {
            if (user && post && message) {
              await sendComment(
                user,
                post,
                message.trim(),
                setMessage,
                setUpdate,
              );
            }
          }}
        />
      </Field>
      <CommentMessage comments={comments} user={user} />
    </>
  );
};

export default PostDetails;
