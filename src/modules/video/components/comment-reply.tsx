import { trpc } from "@/trpc/client";
import CommentItem from "./comment-item";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
  parentId: string;
  videoId: string;
}

const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: 5,
        videoId,
        parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.cursor,
      }
    );
  return (
    <>
      {isLoading && <Loader2Icon className="mx-4 animate-spin" />}
      {!isLoading && (
        <div className="flex flex-col gap-2">
          {data?.pages
            .flatMap((page) => page.items)
            .map((reply, index) => (
              <CommentItem key={index} commentItem={reply} variant="reply" />
            ))}
        </div>
      )}
      {!isLoading && hasNextPage ? (
        <Button
          variant="hyperlink"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          <p className="mt-1">Show more replies</p>
        </Button>
      ) : null}
    </>
  );
};

export default CommentReplies;
