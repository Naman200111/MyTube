"use client";

import { Button } from "@/components/ui/button";
import { mergeClasses } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import MuxPlayer from "@mux/mux-player-react";
import { AlertTriangleIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
  const [showingMoreDesc, setShowingMoreDesc] = useState<boolean>(false);
  const { muxStatus, title, description } = data[0];
  const isProcessing = muxStatus !== "ready";
  // return <div>{JSON.stringify(data)}</div>;
  return (
    <>
      <div className="flex flex-col gap-4 flex-1 mx-auto max-w-[1440px] p-2 lg:px-6 lg:flex-row">
        <div className="flex flex-col gap-4 lg:max-w-[70%]">
          <div
            className={mergeClasses(
              "flex flex-col overflow-hidden",
              isProcessing ? `rounded-b-none` : `rounded-xl`
            )}
          >
            <>
              <MuxPlayer
                className="aspect-video"
                placeholder="/placeholder.svg"
                playerInitTime={0}
                autoPlay={true}
                playbackId={data?.[0]?.playbackId || ""}
              />
              {isProcessing ? (
                <div className="p-2 bg-yellow-300 flex gap-2">
                  <AlertTriangleIcon />
                  <p>Video is still under processing...</p>
                </div>
              ) : null}
            </>
          </div>
          <div>
            <p className="font-bold">{title}</p>
            <div>channel and video stats</div>
          </div>
          <div
            className="bg-gray-100 p-2 rounded-md"
            // onClick={() => setShowingMoreDesc((prev) => !prev)}
          >
            <div className="mb-1">
              views and posted at
              {/* views and date posted */}
            </div>
            <div
              className={mergeClasses(
                showingMoreDesc ? "mb-1" : "line-clamp-2 mb-1"
              )}
            >
              {description}
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
          <div className="">
            {/* comments */}
            <p>Comments</p>
          </div>
        </div>
        <div className="flex flex-1">
          {/* suggestions */}
          <p>Suggestions</p>
        </div>
      </div>
    </>
  );
};

export default VideoSection;
