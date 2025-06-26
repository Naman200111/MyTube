import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import UserAvatar from "@/components/user-avatar";
import useClickOutside from "@/hooks/use-click-outside";
import {
  getCountShortForm,
  getShortFormDateFromDate,
  getVideoTimeFromDuration,
} from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type VideoType = inferProcedureOutput<AppRouter["suggestions"]["getMany"]>;

interface VideoCardProps {
  item: VideoType["items"][0];
  size?: "compact" | "default" | "grid" | "mobile";
}

interface VideoCardPropsMobile {
  item: VideoType["items"][0];
  size?: "compact" | "default" | "grid" | "mobile";
  setShowDropDown: (prev: boolean) => void;
  showDropDown: boolean;
}

const videoCardVariants = cva("cursor-pointer w-full", {
  variants: {
    size: {
      compact: "flex gap-2 mb-2 min-h-[80px]",
      default: "flex gap-4 mb-4 min-h-[200px]",
      grid: "flex flex-col gap-2",
      mobile: "flex flex-col gap-2 mb-2 min-h-[300px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const videoDetailsVariant = cva("text-gray-500 flex", {
  variants: {
    size: {
      compact: "flex-col text-[0.6em]",
      default: "flex-col-reverse text-[0.5em]",
      grid: "flex-col text-[0.6em] ml-10",
      mobile: "flex-col text-[0.6em] ml-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const VideoCardDetailsForMobileAndGrid = ({
  size,
  item: video,
  setShowDropDown,
  showDropDown,
}: VideoCardPropsMobile) => {
  return (
    <div className="flex justify-between">
      <div>
        <div className="flex gap-2 items-">
          <UserAvatar size="sm" imageUrl={video.user.imageUrl} />
          <div className="text-sm font-semibold line-clamp-2">
            {video.title}
          </div>
        </div>
        <div className={videoDetailsVariant({ size })}>
          <div className="flex gap-2 items-center">
            <div>{video.user.name}</div>
          </div>
          <div className="flex gap-1 items-center">
            <div>{getCountShortForm(video.viewCount)} views </div>
            <p className="font-bold mb-[0.5em]">.</p>
            <div>{getShortFormDateFromDate(video.createdAt)}</div>
          </div>
        </div>
      </div>
      <DropDownTrigger
        onClick={(e) => {
          e.stopPropagation();
          setShowDropDown(!showDropDown);
        }}
        className="mt-1"
      >
        {showDropDown ? <DropDownItem>Add to playlist</DropDownItem> : null}
      </DropDownTrigger>
    </div>
  );
};

const VideoCardDetailsForCompactAndDefault = ({
  size,
  item: video,
}: VideoCardProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="text-sm font-semibold">{video.title}</div>
      <div className={videoDetailsVariant({ size })}>
        <div className="flex gap-2 items-center">
          {size !== "compact" ? (
            <UserAvatar size="xs" imageUrl={video.user.imageUrl} />
          ) : null}
          <div>{video.user.name}</div>
        </div>
        <div className="flex gap-1 items-center">
          <div>{getCountShortForm(video.viewCount)} views </div>
          <p className="font-bold mb-[0.5em]">.</p>
          <div>{getShortFormDateFromDate(video.createdAt)}</div>
        </div>
      </div>
      {size === "default" ? (
        <div className="text-xs text-gray-500 mt-3 line-clamp-2">
          {video.description}
        </div>
      ) : null}
    </div>
  );
};

const VideoCard = ({ item: video, size = "default" }: VideoCardProps) => {
  const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  useClickOutside(() => setShowDropDown(false));

  return (
    <div
      className={videoCardVariants({ size })}
      onClick={() => router.push(`/video/${video.id}`)}
    >
      <div className="rounded-md overflow-hidden relative md:w-[50%] flex-1 w-[100%]">
        <div className="absolute rounded-md px-1 bottom-2 right-2 bg-foreground text-background text-xs z-10">
          {getVideoTimeFromDuration(video.duration)}
        </div>
        <Image
          src={video.thumbnailURL || "/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="object-cover"
        />
      </div>
      {size === "mobile" || size === "grid" ? (
        <VideoCardDetailsForMobileAndGrid
          item={video}
          size={size}
          setShowDropDown={setShowDropDown}
          showDropDown={showDropDown}
        />
      ) : (
        <VideoCardDetailsForCompactAndDefault item={video} size={size} />
      )}
      {size === "compact" || size === "default" ? (
        <DropDownTrigger
          onClick={(e) => {
            e.stopPropagation();
            setShowDropDown((prev) => !prev);
          }}
          className="mt-1"
        >
          {showDropDown ? <DropDownItem>Add to playlist</DropDownItem> : null}
        </DropDownTrigger>
      ) : null}
    </div>
  );
};

export default VideoCard;
