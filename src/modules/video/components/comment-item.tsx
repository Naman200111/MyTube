import { getShortFormDateFromDate } from "@/lib/utils";
import Image from "next/image";

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
    videoId: string | null;
    userId: string | null;
    value: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

const CommentItem = ({ commentItem }: CommentItemProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Image
        src={commentItem.user?.imageUrl || "/user-placeholder.svg"}
        alt="user"
        width={40}
        height={30}
        className="rounded-full"
      />
      <div className="flex flex-col text-xs">
        <div className="flex gap-2 items-center">
          <p className="font-semibold">{commentItem.user?.name || "User"}</p>
          <p className="text-gray-500 text-xs">
            {getShortFormDateFromDate(commentItem.createdAt)}
          </p>
        </div>
        <p className="text-sm">{commentItem.value}</p>
      </div>
    </div>
  );
};

export default CommentItem;
