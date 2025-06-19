import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { getSnakeCasing } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CommentInputProps {
  videoId: string;
  variant?: "comment" | "reply";
  handleCommentInputClose?: () => void;
  parentId?: string;
}

const CommentInput = ({
  videoId,
  variant = "comment",
  handleCommentInputClose,
  parentId,
}: CommentInputProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const utils = trpc.useUtils();
  const [commentValue, setCommentValue] = useState("");
  const isReply = variant === "reply";

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
      parentId,
    });
  };

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-2 items-center">
        <Image
          src={user?.imageUrl || "/user-placeholder.svg"}
          alt="user"
          width={isReply ? 30 : 40}
          height={isReply ? 20 : 30}
          className="rounded-full"
        />
        <Input
          placeholder={isReply ? "Reply to this comment..." : "Add a comment"}
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
      <div className="self-end mt-1 flex gap-1">
        {isReply && (
          <Button
            className="rounded-full"
            variant="ghost"
            size="sm"
            onClick={handleCommentInputClose}
          >
            Cancel
          </Button>
        )}

        <Button
          className="rounded-full"
          size="sm"
          disabled={!commentValue || createComment.isPending}
          onClick={handleCommentSubmit}
        >
          {getSnakeCasing(variant)}
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
