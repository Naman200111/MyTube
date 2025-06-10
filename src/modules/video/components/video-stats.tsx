import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { getCountShortForm, mergeClasses } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import {
  ListPlusIcon,
  ShareIcon,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type VideoReactionType = "like" | "dislike" | null;
type SubscribeOptions = "subscribe" | "unsubscribe";

interface VideoStatsProps {
  title: string;
  name: string;
  imageUrl: string;
  videoId: string;
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
}: VideoStatsProps) => {
  const utils = trpc.useUtils();
  const auth = useAuth();
  const clerk = useClerk();

  const [reactionUpdateInProgress, setReactionUpdateInProgress] =
    useState(false);

  const likeReaction = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      setReactionUpdateInProgress(false);
    },
    onError: () => {
      // Todos: Ask user to sign in
      if (!auth.isSignedIn) {
        clerk.openSignIn();
        return;
      }
      setReactionUpdateInProgress(false);
      toast.error("Failed to like video");
    },
  });

  const dislikeReaction = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      setReactionUpdateInProgress(false);
    },
    onError: () => {
      // Todos: Ask user to sign in
      if (!auth.isSignedIn) {
        clerk.openSignIn();
        return;
      }
      setReactionUpdateInProgress(false);
      toast.error("Failed to dislike video");
    },
  });

  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
    },
    onError: () => {
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
    if (!auth.isSignedIn) {
      clerk.openSignIn();
      return;
    }
    if (type == "subscribe") {
      subscribe.mutate({ videoId });
    } else {
      unsubscribe.mutate({ videoId });
    }
  };

  const likeCountNomenclature = getCountShortForm(likeCount);
  const dislikeCountNomenclature = getCountShortForm(dislikeCount);
  const likeButtonFillValue = viewerReaction === "like" ? "black" : "none";
  const dislikeButtonFillValue =
    viewerReaction === "dislike" ? "black" : "none";
  const subscribersCountNomenclature = getCountShortForm(subscribersCount);

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
            <p className="text-xs">
              {subscribersCountNomenclature} subscribers
            </p>
          </div>
          {!isViewerSubscribed ? (
            <Button
              className="rounded-full"
              onClick={() => handleSubscribeOperation("subscribe")}
              disabled={subscribe.isPending || unsubscribe.isPending}
            >
              Subscribe
            </Button>
          ) : (
            <Button
              className="rounded-full"
              onClick={() => handleSubscribeOperation("unsubscribe")}
              disabled={subscribe.isPending || unsubscribe.isPending}
            >
              Unsubscribe
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex items-center cursor-pointer">
            <div
              className={mergeClasses(
                "p-2 rounded-full rounded-r-none border-r-[0.5px] flex gap-2 items-center bg-gray-100 hover:bg-slate-200",
                reactionUpdateInProgress ? "opacity-50" : ""
              )}
              onClick={() => handleVideoReaction("like")}
            >
              <ThumbsUp fill={likeButtonFillValue} size={15} />
              <p className="text-xs">{likeCountNomenclature}</p>
            </div>
            <div
              className={mergeClasses(
                "p-2 rounded-full rounded-l-none bg-gray-100 flex gap-2 items-center hover:bg-slate-200",
                reactionUpdateInProgress ? "opacity-50" : ""
              )}
              onClick={() => handleVideoReaction("dislike")}
            >
              <ThumbsDown fill={dislikeButtonFillValue} size={15} />
              <p className="text-xs">{dislikeCountNomenclature}</p>
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
