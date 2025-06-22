"use client";

import { trpc } from "@/trpc/client";
import CommentInput from "../components/comment-input";
import CommentItem from "../components/comment-item";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "@/components/infinite-scroll";
import CommentSectionSkeleton from "../skeletons/comment-section";

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<CommentSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load comments..</p>}>
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const [commentsList, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    { videoId, limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const { hasNextPage, fetchNextPage, isFetchingNextPage } = query;

  const pages = commentsList.pages;
  const items = pages.flatMap((page) => page.items) || [];
  const totalCommentsCount = pages[0].commentsCount;

  return (
    <div className="flex flex-col gap-2 mx-4 md:m-0">
      <div className="font-semibold">{totalCommentsCount} Comments</div>
      <CommentInput videoId={videoId} />
      <div className="flex flex-col gap-6">
        {items.map((commentItem, index) => (
          <CommentItem key={index} commentItem={commentItem} />
        ))}
        <InfiniteScroll
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          endMessage="No more comments to show."
          manual={true}
        />
      </div>
    </div>
  );
};

export default CommentSection;
