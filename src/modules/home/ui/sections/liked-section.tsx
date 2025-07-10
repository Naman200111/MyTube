"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";

const LikedSection = () => {
  return (
    <Suspense fallback={<VerticalFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load your liked videos...</p>}>
        <LikedSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedSectionSuspense = () => {
  const isMobile = useIsMobileSmall();
  const [likedData, query] = trpc.videos.getManyLiked.useSuspenseInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = likedData.pages;
  const likedVideos = pages.flatMap((page) => page.items) || [];
  return (
    <div className="flex flex-col items-center w-[100%] max-w-[720px] gap-2 xs:px-2">
      {likedVideos.map((video, index) => (
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

export default LikedSection;
