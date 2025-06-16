import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CommentInputProps {
  videoId: string;
}

const CommentInput = ({ videoId }: CommentInputProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const utils = trpc.useUtils();
  const [commentValue, setCommentValue] = useState("");

  const createComment = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.message("Comment Added");
      utils.comments.getMany.invalidate({ videoId, limit: 5 });
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
    createComment.mutate({
      videoId,
      value: commentValue,
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <Image
          src={user?.imageUrl || "/user-placeholder.svg"}
          alt="user"
          width={40}
          height={30}
          className="rounded-full"
        />
        <Input
          placeholder="Add a comment"
          className="flex-1 p-[0.25em] border border-t-0 border-l-0 border-r-0 pl-3 rounded-none"
          onChange={(e) => setCommentValue(e.target.value)}
          value={commentValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommentSubmit();
            }
          }}
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

export default CommentInput;
