"use client";

import { trpc } from "@/trpc/client";
import CommentInput from "../components/comment-input";
import CommentItem from "../components/comment-item";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const [commentsList] = trpc.comments.getMany.useSuspenseQuery({ videoId });
  console.log(commentsList, "commentsList");
  return (
    <div className="flex flex-col gap-2">
      {/* comments */}
      <div className="font-semibold">0 Comments</div>
      <CommentInput videoId={videoId} />
      <div className="flex flex-col gap-6">
        {commentsList.map((commentItem, index) => (
          <CommentItem key={index} commentItem={commentItem} />
        ))}
        <div className="my-4 text-gray-600 self-center">End of comments</div>
      </div>
    </div>
  );
};

export default CommentSection;
