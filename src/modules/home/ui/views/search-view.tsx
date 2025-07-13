"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SearchPageViewSkeleton from "../skeletons/search-page";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";

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
  const isMobile = useIsMobileSmall();
  const [searchedData, query] =
    trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
      { query: searchQuery, limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  const pages = searchedData.pages;
  const searchedVideos = pages.flatMap((page) => page.items) || [];

  return (
    <div className="flex flex-col items-center w-full lg:w-[70%] xl:w-[50%] lg:mx-auto max-w-[1080px] xs:px-2 gap-2">
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
