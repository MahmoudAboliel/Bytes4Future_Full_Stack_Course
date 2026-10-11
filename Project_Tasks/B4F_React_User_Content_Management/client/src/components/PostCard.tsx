import type { Post, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface PostCardProps {
    post: Post;
    userPost: User;
}
const PostCard = ({ post, userPost }: PostCardProps) => {
  return (
    <div className="flex flex-col p-3 gap-2 border shadow rounded-md">
      <div className="flex items-center gap-2">
        <Avatar size="lg">
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${userPost?.email ?? "guest"}`}
            alt={userPost?.name ?? "user"}
          />
          <AvatarFallback>UP</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">{userPost?.name ?? "user"}</h3>
          <p className="text-xs text-muted-foreground">
            {userPost?.email ?? "user"}
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-lg font-semibold">{post?.title ?? "No title"}</h3>
        <p className="text-sm text-muted-foreground">
          {post?.body ?? "No body"}
        </p>
      </div>
    </div>
  );
}

export default PostCard