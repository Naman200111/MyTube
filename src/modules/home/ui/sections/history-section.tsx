"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";

const HistorySection = () => {
  return (
    <Suspense fallback={<VerticalFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load your history...</p>}>
        <HistorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const HistorySectionSuspense = () => {
  const isMobile = useIsMobileSmall();
  const [trendingData, query] =
    trpc.videos.getManyHistory.useSuspenseInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = trendingData.pages;
  const historyVideos = pages.flatMap((page) => page.items) || [];
  return (
    <div className="flex flex-col items-center w-[100%] max-w-[720px] gap-2">
      {historyVideos.map((video, index) => (
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

export default HistorySection;
