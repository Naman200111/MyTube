import {
  getLongFormDateFromDate,
  getShortFormDateFromDate,
  mergeClasses,
} from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
  createdAt: Date;
  description: string | null;
}
const VideoDescription = ({
  createdAt,
  description,
}: VideoDescriptionProps) => {
  const [showingMoreDesc, setShowingMoreDesc] = useState<boolean>(false);
  const createdAtLongForm = getLongFormDateFromDate(createdAt);
  const createdAtShortForm = getShortFormDateFromDate(createdAt);
  return (
    <div className="bg-gray-100 p-2 rounded-md">
      <div className="mb-1">
        <p>
          {/* Todo: actual views from database */}V Views{" "}
          {showingMoreDesc ? createdAtLongForm : createdAtShortForm}
        </p>
        {/* views and date posted */}
      </div>
      <div
        className={mergeClasses(showingMoreDesc ? "mb-1" : "line-clamp-2 mb-1")}
      >
        {description || "No Description"}
      </div>
      <div
        className="text-sm select-none cursor-pointer"
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
