"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";

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
  const isMobile = useIsMobileSmall();
  const [trendingData, query] =
    trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = trendingData.pages;
  const searchedVideos = pages.flatMap((page) => page.items) || [];
  return (
    <div className="flex flex-col items-center w-[100%] max-w-[720px] gap-2 xs:px-2">
      {searchedVideos.map((video, index) => (
        <VideoCard
          key={index}
          item={video}
          variant="feed"
          size={isMobile ? "mobile" : "default"}
        />
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
