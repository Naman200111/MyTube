import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import {
  ListPlusIcon,
  ShareIcon,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
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
        <div className="flex gap-2 items-center">
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
          <div className="flex items-center cursor-pointer">
            <div className="p-2 rounded-full rounded-r-none border-r-[0.5px] flex gap-2 items-center bg-gray-100">
              <ThumbsUp className="" size={15} />
              <p className="text-xs">20</p>
            </div>
            <div className="p-2 rounded-full rounded-l-none bg-gray-100 flex gap-2 items-center">
              <ThumbsDown size={15} />
            </div>
          </div>
          <div className="rounded-full bg-gray-100 flex items-center cursor-pointer">
            <DropDownTrigger className="bg-accent flex">
              <DropDownItem
                className="w-[150px] self-start justify-self-start"
                icon={<ShareIcon />}
              >
                Share
              </DropDownItem>
              <DropDownItem className="w-[150px]" icon={<ListPlusIcon />}>
                Add to playlist
              </DropDownItem>
              <DropDownItem className="w-[150px]" icon={<Trash />}>
                Remove
              </DropDownItem>
            </DropDownTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStats;
