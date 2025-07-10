"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";
import GridFeedViewSkeleton from "../skeletons/grid-feed";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";

const SubscribedVideosSection = () => {
  return (
    <Suspense fallback={<GridFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load your favourite videos...</p>}>
        <SubscribedVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscribedVideosSectionSuspense = () => {
  const isMobile = useIsMobileSmall();
  const [subscribedVideoData, query] =
    trpc.videos.getManySubscribed.useSuspenseInfiniteQuery(
      { limit: 12 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = subscribedVideoData.pages;
  const favouriteVideos = pages.flatMap((page) => page.items) || [];

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2 xs:px-2">
        {favouriteVideos.map((video, index) => (
          <VideoCard
            key={index}
            item={video}
            variant="feed"
            size={isMobile ? "mobile" : "grid"}
          />
        ))}
      </div>
      <div className="mt-10">
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </>
  );
};

export default SubscribedVideosSection;
