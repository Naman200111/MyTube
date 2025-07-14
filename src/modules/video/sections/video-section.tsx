"use client";

import { mergeClasses } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { AlertTriangleIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoStats from "../components/video-stats";
import VideoDescription from "../components/video-description";
import VideoPlayer from "../components/video-player";
import { useAuth } from "@clerk/clerk-react";
import VideoPageSkeleton from "../skeletons/video-page";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoSectionProps {
  videoId: string;
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoPageSkeleton />}>
      <ErrorBoundary
        fallback={
          <>
            <Skeleton className="h-[500px]" />
            <p>Failed to fetch video</p>
          </>
        }
      >
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [data] = trpc.videos.getOne.useSuspenseQuery({ videoId });
  const {
    muxStatus,
    title,
    description,
    createdAt,
    imageUrl,
    name,
    id,
    viewCount,
    likeCount,
    dislikeCount,
    viewerReaction,
    subscribersCount,
    isViewerSubscribed,
    thumbnailURL,
  } = data[0];

  const isProcessing = muxStatus !== "ready";
  const utils = trpc.useUtils();

  const auth = useAuth();

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate();
    },
  });
  const handlePlay = () => {
    if (auth.isSignedIn) {
      createView.mutate({
        videoId: id,
      });
    }
  };

  return (
    <>
      <div
        className={mergeClasses(
          "flex flex-col overflow-hidden mx-2 md:m-0",
          isProcessing ? `rounded-b-none` : `rounded-xl`
        )}
      >
        <>
          <VideoPlayer
            playbackId={data?.[0]?.playbackId}
            onPlay={handlePlay}
            className={isProcessing ? "rounded-b-none" : ""}
            thumbnailURL={thumbnailURL}
          />
          {isProcessing ? (
            <div className="p-2 bg-yellow-300 flex gap-2 rounded-md rounded-t-none pl-4">
              <AlertTriangleIcon />
              <p>Video is still under processing...</p>
            </div>
          ) : null}
        </>
      </div>
      <VideoStats
        title={title}
        imageUrl={imageUrl}
        name={name}
        videoId={id}
        likeCount={likeCount}
        dislikeCount={dislikeCount}
        viewerReaction={viewerReaction}
        subscribersCount={subscribersCount}
        isViewerSubscribed={isViewerSubscribed}
      />
      <VideoDescription
        createdAt={createdAt}
        description={description}
        viewCount={viewCount}
      />
    </>
  );
};

export default VideoSection;
