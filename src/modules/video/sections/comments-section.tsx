"use client";

import { trpc } from "@/trpc/client";
import CommentItem from "../components/comment-item";

interface CommentSectionProps {
  videoId: string;
}

const CommentSection = ({ videoId }: CommentSectionProps) => {
  const [commentsList] = trpc.comments.getMany.useSuspenseQuery({ videoId });
  console.log(commentsList, "commentsList");
  return (
    <div className="flex flex-col gap-2">
      {/* comments */}
      <div className="font-semibold">0 Comments</div>
      <CommentItem videoId={videoId} />
    </div>
  );
};

export default CommentSection;
