"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import GridFeedViewSkeleton from "../skeletons/grid-feed";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";

interface VideoHomeFeedSectionProps {
  selectedCategory: string;
}

export const VideosHomeFeedSection = ({
  selectedCategory,
}: VideoHomeFeedSectionProps) => {
  return (
    <Suspense fallback={<GridFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to fetch videos...</p>}>
        <VideosHomeFeedSuspense selectedCategory={selectedCategory} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosHomeFeedSuspense = ({
  selectedCategory,
}: VideoHomeFeedSectionProps) => {
  const [data, query] = trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
    {
      limit: 12,
      category: selectedCategory,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;
  const pages = data.pages;
  const items = pages.flatMap((page) => page.items);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-2">
        {items.map((item, index) => (
          <VideoCard key={index} item={item} size="grid" />
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

export default VideosHomeFeedSection;
