import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CommentItemProps {
  videoId: string;
}

const CommentItem = ({ videoId }: CommentItemProps) => {
  const clerk = useClerk();
  const auth = useAuth();
  const imageUrl = "";
  const [commentValue, setCommentValue] = useState("");

  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.message("Comment Added");
      setCommentValue("");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.message("Something went wrong");
    },
  });

  const handleCommentSubmit = () => {
    if (!auth.userId) {
      return;
    }
    createComment.mutate({
      videoId,
      value: commentValue,
      clerkUserId: auth.userId,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <Image
          src={imageUrl || "/user-placeholder.svg"}
          alt="P"
          width={40}
          height={30}
          className="rounded-full"
        />
        <Input
          placeholder="Add a comment"
          className="flex-1 p-[0.25em] border border-t-0 border-l-0 border-r-0 rounded-none"
          onChange={(e) => setCommentValue(e.target.value)}
          value={commentValue}
        />
      </div>
      <Button
        className="self-end mt-1"
        size="sm"
        disabled={!commentValue || createComment.isPending}
        onClick={handleCommentSubmit}
      >
        Comment
      </Button>
    </div>
  );
};

export default CommentItem;
