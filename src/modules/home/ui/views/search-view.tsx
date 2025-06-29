"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SearchPageViewSkeleton from "../skeletons/search-page";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import { useIsMobile } from "@/hooks/use-mobile";
import InfiniteScroll from "@/components/infinite-scroll";

interface SearchViewProps {
  searchQuery?: string;
}

const SearchView = ({ searchQuery }: SearchViewProps) => {
  return (
    <Suspense fallback={<SearchPageViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to fetch results..</p>}>
        <SearchViewSuspense searchQuery={searchQuery} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SearchViewSuspense = ({ searchQuery }: SearchViewProps) => {
  const isMobile = useIsMobile();
  const [searchedData, query] =
    trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
      { query: searchQuery, limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = searchedData.pages;
  const searchedVideos = pages.flatMap((page) => page.items) || [];

  return (
    <div className="flex flex-col items-center w-full mx-2 lg:w-[70%] xl:w-[50%] lg:mx-auto max-w-[1080px]">
      {searchedVideos.map((video, index) => (
        <VideoCard
          key={index}
          item={video}
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

export default SearchView;
