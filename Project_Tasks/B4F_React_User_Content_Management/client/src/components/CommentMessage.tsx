import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import type { Comment, User } from "@/lib/types";

const CommentMessage = ({
  comments,
  user,
}: {
  comments: Comment[];
  user: User | null;
}) => {
  return (
    <div className="flex w-full  flex-col justify-center gap-4 py-4">
      {comments.map((comment) => {
        // In React, calling a state updater function during render causes an immediate re-render.
        // handleToggle();
        return (
          <Message key={comment.id} align={comment.email === user?.email ? "end" : "start"}>
            <MessageAvatar>
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.email ?? "guest"}`} alt={comment.name} />
                <AvatarFallback>UC</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant={comment.email === user?.email ? "muted" : "secondary"}>
                <BubbleContent>{comment.body}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        );
      })}
    </div>
  );
};

export default CommentMessage;
