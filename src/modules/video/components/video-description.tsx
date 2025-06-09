import {
  getLongFormDateFromDate,
  getShortFormDateFromDate,
  getCountLongForm,
  getCountShortForm,
  mergeClasses,
} from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
  createdAt: Date;
  description: string | null;
  viewCount: number;
}
const VideoDescription = ({
  createdAt,
  description,
  viewCount,
}: VideoDescriptionProps) => {
  const [showingMoreDesc, setShowingMoreDesc] = useState<boolean>(false);
  const createdAtLongForm = getLongFormDateFromDate(createdAt);
  const createdAtShortForm = getShortFormDateFromDate(createdAt);
  const viewCountLongForm = getCountLongForm(viewCount);
  const viewCountShortForm = getCountShortForm(viewCount);

  return (
    <div className="bg-gray-100 p-2 rounded-md">
      <div className="mb-1">
        <p className="text-sm font-semibold">
          {showingMoreDesc ? viewCountLongForm : viewCountShortForm} views{" "}
          {showingMoreDesc ? createdAtLongForm : createdAtShortForm}
        </p>
      </div>
      <div
        className={mergeClasses(showingMoreDesc ? "mb-1" : "line-clamp-2 mb-1")}
      >
        {description || "No Description"}
      </div>
      <div
        className="text-sm select-none cursor-pointer font-semibold"
        onClick={() => setShowingMoreDesc((prev) => !prev)}
      >
        {showingMoreDesc ? (
          <p className="flex items-center gap-1 text-xs">
            Show less <ChevronUp size={16} />
          </p>
        ) : (
          <p className="flex items-center gap-1 text-xs">
            Show more <ChevronDown size={16} />
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoDescription;
