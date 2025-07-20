"use client";

import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import useClickOutside from "@/hooks/use-click-outside";
import { getCountShortForm, mergeClasses } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ListPlusIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AddToPlaylistModal from "./add-to-playlist-modal";

type VideoReactionType = "like" | "dislike" | null;
type SubscribeOptions = "subscribe" | "unsubscribe";

interface VideoStatsProps {
  title: string;
  name: string;
  imageUrl: string;
  videoId: string;
  creatorId: string;
  likeCount: number;
  dislikeCount: number;
  viewerReaction: VideoReactionType;
  subscribersCount: number;
  isViewerSubscribed: number;
}

const VideoStats = ({
  title,
  name,
  imageUrl,
  videoId,
  likeCount,
  dislikeCount,
  viewerReaction,
  subscribersCount,
  isViewerSubscribed,
  creatorId,
}: VideoStatsProps) => {
  useClickOutside(() => setShowMoreOptions(false));

  const utils = trpc.useUtils();
  const clerk = useClerk();

  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [reactionUpdateInProgress, setReactionUpdateInProgress] =
    useState(false);

  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

  const mutateVideo = trpc.playlists.mutateVideo.useMutation({
    onSuccess: (data) => {
      utils.playlists.getManyForVideo.invalidate();
      utils.playlists.getMany.invalidate();
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

  const likeReaction = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.videos.getManyLiked.invalidate();
      setReactionUpdateInProgress(false);
    },
    onError: (error) => {
      setReactionUpdateInProgress(false);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to like video");
    },
  });

  const dislikeReaction = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.videos.getManyLiked.invalidate();
      setReactionUpdateInProgress(false);
    },
    onError: (error) => {
      setReactionUpdateInProgress(false);
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to dislike video");
    },
  });

  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Something went wrong");
    },
  });
  const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Something went wrong");
    },
  });

  const handleVideoReaction = (type: VideoReactionType) => {
    if (reactionUpdateInProgress) return;
    setReactionUpdateInProgress(true);

    if (type === "like") {
      likeReaction.mutate({
        videoId,
      });
    } else {
      dislikeReaction.mutate({
        videoId,
      });
    }
  };

  const handleSubscribeOperation = (type: SubscribeOptions) => {
    if (type == "subscribe") {
      subscribe.mutate({ creatorId });
    } else {
      unsubscribe.mutate({ creatorId });
    }
  };

  const likeCountNomenclature = getCountShortForm(likeCount);
  const dislikeCountNomenclature = getCountShortForm(dislikeCount);
  const likeButtonFillValue = viewerReaction === "like" ? "black" : "none";
  const dislikeButtonFillValue =
    viewerReaction === "dislike" ? "black" : "none";
  const subscribersCountNomenclature = getCountShortForm(subscribersCount);

  return (
    <div className="flex flex-col gap-2 mx-4 md:m-0">
      <p className="line-clamp-2 font-bold">{title}</p>
      <div className="flex justify-between flex-col md:flex-row gap-2">
        <div className="flex gap-2 items-center">
          <UserAvatar imageUrl={imageUrl} size="lg" />
          <div className="flex-1 md:flex-none">
            <p className="text-sm font-bold">{name}</p>
            <p className="text-xs">
              {subscribersCountNomenclature} subscribers
            </p>
          </div>
          {!isViewerSubscribed ? (
            <Button
              className="rounded-full"
              onClick={() => handleSubscribeOperation("subscribe")}
              disabled={subscribe.isPending || unsubscribe.isPending}
              size="sm"
            >
              Subscribe
            </Button>
          ) : (
            <Button
              className="rounded-full"
              onClick={() => handleSubscribeOperation("unsubscribe")}
              disabled={subscribe.isPending || unsubscribe.isPending}
              size="sm"
            >
              Unsubscribe
            </Button>
          )}
        </div>
        <div className="flex gap-4 ">
          <div className="flex items-center cursor-pointer flex-1 md:flex-none">
            <div
              className={mergeClasses(
                "p-2 rounded-full rounded-r-none border-r-[0.5px] flex gap-2 items-center bg-accent hover:bg-gray-200",
                reactionUpdateInProgress ? "opacity-50" : ""
              )}
              onClick={() => handleVideoReaction("like")}
            >
              <ThumbsUp fill={likeButtonFillValue} size={15} />
              <p className="text-xs">{likeCountNomenclature}</p>
            </div>
            <div
              className={mergeClasses(
                "p-2 rounded-full rounded-l-none bg-accent flex gap-2 items-center hover:bg-gray-200",
                reactionUpdateInProgress ? "opacity-50" : ""
              )}
              onClick={() => handleVideoReaction("dislike")}
            >
              <ThumbsDown fill={dislikeButtonFillValue} size={15} />
              <p className="text-xs">{dislikeCountNomenclature}</p>
            </div>
          </div>
          <DropDownTrigger
            className="bg-accent flex items-center cursor-pointer p-2 m-1 rounded-full"
            onClick={() => setShowMoreOptions((prev) => !prev)}
          >
            {showMoreOptions ? (
              <>
                <DropDownItem
                  className="w-[150px]"
                  icon={<ListPlusIcon />}
                  onClick={() => setAddToPlaylistModalOpen(true)}
                >
                  Add to playlist
                </DropDownItem>
              </>
            ) : null}
          </DropDownTrigger>
        </div>
      </div>
      <AddToPlaylistModal
        onClose={() => setAddToPlaylistModalOpen(false)}
        open={addToPlaylistModalOpen}
        disabled={mutateVideo.isPending}
        videoId={videoId}
        onClick={(playlistId: string, videoId: string) => {
          mutateVideo.mutate({
            videoId,
            playlistId,
          });
        }}
      />
    </div>
  );
};

export default VideoStats;
