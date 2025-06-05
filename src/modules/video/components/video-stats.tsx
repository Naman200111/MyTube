import { Button } from "@/components/ui/button";
import { Ellipsis, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface VideoStatsProps {
  title: string;
  name: string;
  imageUrl: string;
}
const VideoStats = ({ title, name, imageUrl }: VideoStatsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">{title}</p>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Image
            src={imageUrl}
            alt="P"
            width={40}
            height={30}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-bold">{name}</p>
            {/* Todo: fill with actual data */}
            <p className="text-xs">X subscribers</p>
          </div>
          <Button className="rounded-full">Subscribe</Button>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full rounded-r-none border-r-[0.5px] flex gap-2 items-center bg-gray-100">
              <ThumbsUp className="" size={15} />
              <p className="text-xs">20</p>
            </div>
            <div className="p-2 rounded-full rounded-l-none bg-gray-100 flex gap-2 items-center">
              <ThumbsDown size={15} />
            </div>
          </div>
          <div className="p-3 rounded-full bg-gray-100 flex items-center">
            <Ellipsis size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStats;
