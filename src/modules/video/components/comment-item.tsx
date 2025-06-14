import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
import { getShortFormDateFromDate } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CommentItemProps {
  commentItem: {
    user: {
      id: string;
      name: string;
      clerkId: string;
      imageUrl: string;
      createdAt: Date;
      updatedAt: Date;
    };
    id: string;
    videoId: string;
    userId: string;
    value: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

const CommentItem = ({ commentItem }: CommentItemProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const isMyComment = user?.id === commentItem.user.clerkId;

  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  useClickOutside(() => setShowMoreOptions(false));

  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.message("Comment deleted");
      utils.comments.getMany.invalidate({
        videoId: commentItem.videoId,
        limit: 5,
      });
    },
    onError: () => {
      toast.message("Something went wrong");
    },
  });

  const handleDeleteComment = () => {
    if (!isMyComment) {
      toast.error("You cannot perform this action !!");
      return;
    }
    deleteComment.mutate({ commentId: commentItem.id });
  };

  return (
    <div className="flex gap-2">
      <Image
        src={commentItem.user?.imageUrl || "/user-placeholder.svg"}
        alt="user"
        width={40}
        height={30}
        className="rounded-full"
      />
      <div className="flex justify-between flex-1">
        <div className="flex flex-col text-xs gap-[2px]">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">{commentItem.user?.name || "User"}</p>
            <p className="text-gray-500 text-xs">
              {getShortFormDateFromDate(commentItem.createdAt)}
            </p>
          </div>
          <p className="text-sm flex-1">{commentItem.value}</p>
        </div>
        <div className="flex-end cursor-pointer">
          <DropDownTrigger
            className="hover:bg-gray-100 hover:rounded-full p-2"
            onClick={() => setShowMoreOptions((prev) => !prev)}
          >
            {showMoreOptions ? (
              <>
                <DropDownItem onClick={handleDeleteComment}>
                  Delete
                </DropDownItem>
              </>
            ) : null}
          </DropDownTrigger>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
