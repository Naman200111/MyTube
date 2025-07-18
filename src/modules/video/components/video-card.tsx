"use client";

import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import UserAvatar from "@/components/user-avatar";
import useClickOutside from "@/hooks/use-click-outside";
import {
  getCountShortForm,
  getShortFormDateFromDate,
  getVideoTimeFromDuration,
  mergeClasses,
} from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AddToPlaylistModal from "./add-to-playlist-modal";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";

type VideoType = inferProcedureOutput<AppRouter["suggestions"]["getMany"]>;

interface VideoCardProps {
  item: VideoType["items"][0];
  size?: "compact" | "default" | "grid" | "mobile";
  variant?: "default" | "feed";
  onClick?: () => void;
}

interface VideoCardProps_v2 {
  onClick?: () => void;
  item: VideoType["items"][0];
  size?: "compact" | "default" | "grid" | "mobile";
  setShowDropDown: (prev: boolean) => void;
  showDropDown: boolean;
  openAddToPlaylistModal: () => void;
}

const VideoCardGrid = ({
  onClick,
  item: video,
  setShowDropDown,
  showDropDown,
  openAddToPlaylistModal,
}: VideoCardProps_v2) => {
  return (
    <div
      className="cursor-pointer h-[280px] w-full flex flex-col gap-2"
      onClick={onClick}
    >
      <div className="rounded-md overflow-hidden relative h-[70%] w-[100%]">
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
      <div className="flex justify-between">
        <div>
          <div className="flex gap-2 items-center">
            <UserAvatar imageUrl={video.user.imageUrl} />
            <div className="text-xs font-semibold line-clamp-2">
              {video.title}
            </div>
          </div>
          <div className="text-[0.6em] text-muted-foreground ml-9 mt-[4px]">
            <Link
              href={`/user/${video.user.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hover:font-semibold">{video.user.name}</div>
            </Link>
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
          {showDropDown ? (
            <DropDownItem onClick={openAddToPlaylistModal}>
              Add to playlist
            </DropDownItem>
          ) : null}
        </DropDownTrigger>
      </div>
    </div>
  );
};

const VideoCardMobile = ({
  item: video,
  setShowDropDown,
  showDropDown,
  onClick,
  openAddToPlaylistModal,
}: VideoCardProps_v2) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer h-[320px] w-full flex flex-col gap-2 mt-2"
    >
      <div className="overflow-hidden relative h-full">
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
      <div className="flex justify-between mx-2">
        <div>
          <div className="flex gap-2">
            <UserAvatar size="lg" imageUrl={video.user.imageUrl} />
            <div className="text-xs font-semibold line-clamp-2">
              {video.title}
            </div>
          </div>
          <div className="text-[0.6em] text-muted-foreground ml-10 mt-1">
            <Link
              href={`/user/${video.user.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hover:font-semibold">{video.user.name}</div>
            </Link>
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
          {showDropDown ? (
            <DropDownItem onClick={openAddToPlaylistModal}>
              Add to playlist
            </DropDownItem>
          ) : null}
        </DropDownTrigger>
      </div>
    </div>
  );
};

const VideoCardPrimary = ({ item: video, variant }: VideoCardProps) => {
  return (
    <div
      className={mergeClasses(
        "cursor-pointer w-full flex gap-2",
        variant === "feed" ? "h-[120px]" : "h-[200px]"
      )}
    >
      <div
        className={mergeClasses(
          "rounded-xl overflow-hidden relative h-full",
          variant === "feed" ? "w-[30%] min-w-[200px]" : "w-[60%] max-w-[340px]"
        )}
      >
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
      <div className="overflow-hidden flex-1">
        <div className="text-sm font-semibold line-clamp-1">{video.title}</div>
        <div className="text-[0.5em] text-muted-foreground">
          <div className="flex gap-1 items-center">
            <div>{getCountShortForm(video.viewCount)} views </div>
            <p className="font-bold mb-[0.5em]">.</p>
            <div>{getShortFormDateFromDate(video.createdAt)}</div>
          </div>
          <div className="flex gap-2 items-center">
            <UserAvatar size="sm" imageUrl={video.user.imageUrl} />
            <Link
              href={`/user/${video.user.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hover:font-semibold">{video.user.name}</div>
            </Link>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-3 line-clamp-2">
          {video.description}
        </div>
      </div>
    </div>
  );
};

const VideoCardCompact = ({ item: video, onClick }: VideoCardProps) => {
  return (
    <div
      className="cursor-pointer h-[90px] w-full flex gap-2"
      onClick={onClick}
    >
      <div className="rounded-md overflow-hidden relative h-full w-[30%] lg:w-[50%]">
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
      <div className="text-nowrap">
        <div className="text-sm font-semibold line-clamp-1">{video.title}</div>
        <div className="text-[0.6em] text-muted-foreground">
          <Link
            href={`/user/${video.user.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hover:font-semibold">{video.user.name}</div>
          </Link>
          <div className="flex gap-1 items-center">
            <div>{getCountShortForm(video.viewCount)} views </div>
            <p className="font-bold mb-[0.5em]">.</p>
            <div>{getShortFormDateFromDate(video.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({
  item: video,
  size = "default",
  variant = "default",
}: VideoCardProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const auth = useAuth();
  const clerk = useClerk();

  const [showDropDown, setShowDropDown] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

  const openAddToPlaylistModal = () => {
    if (!auth.isSignedIn) {
      clerk.openSignIn();
      return;
    }
    return setAddToPlaylistModalOpen(true);
  };

  const mutateVideo = trpc.playlists.mutateVideo.useMutation({
    onSuccess: (data) => {
      utils.playlists.getManyForVideo.invalidate();
      utils.playlists.getMany.invalidate();
      utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
      if (data.videoAdded) {
        toast.success(`Added to ${data.name}`);
      } else {
        toast.success(`Removed from ${data.name}`);
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  useClickOutside(() => setShowDropDown(false));
  return (
    <>
      {size === "mobile" && (
        <VideoCardMobile
          item={video}
          size={size}
          setShowDropDown={setShowDropDown}
          showDropDown={showDropDown}
          onClick={() => router.push(`/video/${video.id}`)}
          openAddToPlaylistModal={openAddToPlaylistModal}
        />
      )}
      {size === "grid" && (
        <VideoCardGrid
          item={video}
          size={size}
          setShowDropDown={setShowDropDown}
          showDropDown={showDropDown}
          onClick={() => router.push(`/video/${video.id}`)}
          openAddToPlaylistModal={openAddToPlaylistModal}
        />
      )}
      {size === "compact" && (
        <div className="flex gap-1 mb-2 w-full">
          <VideoCardCompact
            item={video}
            size={size}
            onClick={() => router.push(`/video/${video.id}`)}
          />
          <DropDownTrigger
            onClick={() => setShowDropDown((prev) => !prev)}
            className="mt-1"
          >
            {showDropDown ? (
              <DropDownItem onClick={openAddToPlaylistModal}>
                Add to playlist
              </DropDownItem>
            ) : null}
          </DropDownTrigger>
        </div>
      )}
      {size === "default" && (
        <div
          className="flex gap-1 mb-2 w-full"
          onClick={() => router.push(`/video/${video.id}`)}
        >
          <VideoCardPrimary item={video} size={size} variant={variant} />
          <DropDownTrigger
            onClick={(e) => {
              e.stopPropagation();
              setShowDropDown((prev) => !prev);
            }}
            className="mt-1"
          >
            {showDropDown ? (
              <DropDownItem onClick={openAddToPlaylistModal}>
                Add to playlist
              </DropDownItem>
            ) : null}
          </DropDownTrigger>
        </div>
      )}
      <AddToPlaylistModal
        onClose={() => setAddToPlaylistModalOpen(false)}
        open={addToPlaylistModalOpen}
        disabled={mutateVideo.isPending}
        videoId={video.id}
        onClick={(playlistId: string, videoId: string) => {
          mutateVideo.mutate({
            videoId,
            playlistId,
          });
        }}
      />
    </>
  );
};

export default VideoCard;
