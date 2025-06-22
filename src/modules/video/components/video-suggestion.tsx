import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
import {
  getCountShortForm,
  getShortFormDateFromDate,
  getVideoTimeFromDuration,
} from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SuggestionVideoType = inferProcedureOutput<
  AppRouter["suggestions"]["getMany"]
>;

interface VideoSuggestionProps {
  item: SuggestionVideoType["items"][0];
}

const VideoSuggestion = ({ item: video }: VideoSuggestionProps) => {
  const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  useClickOutside(() => setShowDropDown(false));

  return (
    <div
      className="flex gap-2 cursor-pointer"
      onClick={() => router.push(`/video/${video.id}`)}
    >
      <div className="flex flex-col relative">
        <div className="absolute rounded-md px-1 bottom-2 right-2 bg-foreground  text-background text-xs">
          {getVideoTimeFromDuration(video.duration)}
        </div>
        <Image
          src={video.thumbnailURL || "/placeholder.svg"}
          alt="Thumbnail"
          width={120}
          height={120}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-sm font-semibold">{video.title}</div>
        <div className="text-[0.5em] text-gray-500">
          <div>{video.user.name}</div>
          <div className="flex gap-1 items-center">
            <div>{getCountShortForm(video.viewCount)} views </div>
            <p className="font-bold mb-[0.5em]">.</p>
            <div>{getShortFormDateFromDate(video.createdAt)}</div>
          </div>
        </div>
      </div>
      <DropDownTrigger
        onClick={() => setShowDropDown((prev) => !prev)}
        className="mt-1"
      >
        {showDropDown ? <DropDownItem>Add to playlist</DropDownItem> : null}
      </DropDownTrigger>
    </div>
  );
};

export default VideoSuggestion;
