"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";

const TrendingSection = () => {
  return (
    <Suspense fallback={<VerticalFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load trending videos...</p>}>
        <TrendingSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const TrendingSectionSuspense = () => {
  const [trendingData, query] =
    trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = trendingData.pages;
  const searchedVideos = pages.flatMap((page) => page.items) || [];
  return (
    <div className="flex flex-col items-center mx-2 w-[60%] ml-10 max-w-[1080px]">
      {searchedVideos.map((video, index) => (
        <VideoCard key={index} item={video} variant="feed" />
      ))}
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default TrendingSection;
