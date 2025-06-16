import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
import {
  getCountShortForm,
  getShortFormDateFromDate,
  mergeClasses,
} from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDown, ThumbsUp } from "lucide-react";
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
    likeCount: number;
    dislikeCount: number;
    viewerReaction: "like" | "dislike" | null;
  };
}

const CommentItem = ({ commentItem }: CommentItemProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [reactionUpdateInProgress, setReactionUpdateInProgress] =
    useState(false);

  useClickOutside(() => setShowMoreOptions(false));

  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.message("Comment deleted");
      utils.comments.getMany.invalidate({
        videoId: commentItem.videoId,
        limit: 5,
      });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.message("Something went wrong");
    },
  });

  const likeReaction = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: commentItem.videoId });
      setReactionUpdateInProgress(false);
    },
    onError: (error) => {
      setReactionUpdateInProgress(false);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to like comment");
    },
  });

  const dislikeReaction = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: commentItem.videoId });
      setReactionUpdateInProgress(false);
    },
    onError: (error) => {
      setReactionUpdateInProgress(false);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to dislike comment");
    },
  });

  const handleDeleteComment = () => {
    deleteComment.mutate({ commentId: commentItem.id });
  };

  const handleCommentReaction = (type: "like" | "dislike") => {
    if (reactionUpdateInProgress) return;
    setReactionUpdateInProgress(true);

    if (type == "like") {
      likeReaction.mutate({ commentId: commentItem.id });
    } else {
      dislikeReaction.mutate({ commentId: commentItem.id });
    }
  };

  const likeButtonFillValue =
    commentItem.viewerReaction === "like" ? "black" : "none";
  const dislikeButtonFillValue =
    commentItem.viewerReaction === "dislike" ? "black" : "none";
  const likeCountNomenclature = getCountShortForm(commentItem.likeCount);
  const dislikeCountNomenclature = getCountShortForm(commentItem.dislikeCount);

  return (
    <div className="flex flex-col">
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
              <p className="font-semibold">
                {commentItem.user?.name || "User"}
              </p>
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
      <div className="pl-[2.75em]">
        <div className="flex items-center cursor-pointer flex-1 md:flex-none gap-1">
          <div
            className={mergeClasses(
              "flex gap-[2px] items-center",
              reactionUpdateInProgress ? "opacity-50" : ""
            )}
          >
            <div
              className="p-[6px] rounded-full hover:bg-gray-200"
              onClick={() => handleCommentReaction("like")}
            >
              <ThumbsUp fill={likeButtonFillValue} size={16} />
            </div>
            <p className="text-xs">{likeCountNomenclature}</p>
          </div>
          <div
            className={mergeClasses(
              "flex gap-[2px] items-center ",
              reactionUpdateInProgress ? "opacity-50" : ""
            )}
          >
            <div
              className="p-[6px] rounded-full hover:bg-gray-200"
              onClick={() => handleCommentReaction("dislike")}
            >
              <ThumbsDown fill={dislikeButtonFillValue} size={16} />
            </div>
            <p className="text-xs">{dislikeCountNomenclature}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
