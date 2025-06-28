"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideosHomeFeedSkeleton from "../skeletons/videos-home-feed-section";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";

export const VideosHomeFeedSection = () => {
  return (
    <Suspense fallback={<VideosHomeFeedSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to fetch videos...</p>}>
        <VideosHomeFeedSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosHomeFeedSuspense = () => {
  const [data] = trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
    {
      limit: 12,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );

  const pages = data.pages;
  const items = pages.flatMap((page) => page.items);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-2">
      <>
        {items.map((item, index) => (
          <VideoCard key={index} item={item} size="grid" />
        ))}
      </>
    </div>
  );
};

export default VideosHomeFeedSection;
