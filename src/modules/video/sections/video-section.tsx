"use client";

import { mergeClasses } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { AlertTriangleIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoStats from "../components/video-stats";
import VideoDescription from "../components/video-description";
import VideoPlayer from "../components/video-player";

interface VideoSectionProps {
  videoId: string;
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<>Loading...</>}>
      <ErrorBoundary fallback={<>Error</>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [data] = trpc.videos.getOne.useSuspenseQuery({ videoId });
  const { muxStatus, title, description, createdAt, imageUrl, name } = data[0];
  const isProcessing = muxStatus !== "ready";

  return (
    <>
      <div
        className={mergeClasses(
          "flex flex-col overflow-hidden",
          isProcessing ? `rounded-b-none` : `rounded-xl`
        )}
      >
        <>
          <VideoPlayer playbackId={data?.[0]?.playbackId} autoPlay={true} />
          {isProcessing ? (
            <div className="p-2 bg-yellow-300 flex gap-2">
              <AlertTriangleIcon />
              <p>Video is still under processing...</p>
            </div>
          ) : null}
        </>
      </div>
      <VideoStats title={title} imageUrl={imageUrl} name={name} />
      <VideoDescription createdAt={createdAt} description={description} />
    </>
  );
};

export default VideoSection;
