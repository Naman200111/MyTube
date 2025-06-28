"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SearchViewSkeleton from "../skeletons/search-view";
import { trpc } from "@/trpc/client";
import VideoCard from "@/modules/video/components/video-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchViewProps {
  query: string;
}

const SearchView = ({ query }: SearchViewProps) => {
  return (
    <Suspense fallback={<SearchViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to fetch results..</p>}>
        <SearchViewSuspense query={query} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SearchViewSuspense = ({ query }: SearchViewProps) => {
  const isMobile = useIsMobile();
  const [searchedData] = trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
    { query, limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const pages = searchedData.pages;
  const searchedVideos = pages.flatMap((page) => page.items) || [];
  console.log(searchedVideos, "searchedVideos");

  return (
    <div className="flex flex-col items-center w-full mx-2 lg:w-[70%] xl:w-[50%] lg:mx-auto max-w-[1080px]">
      {searchedVideos.map((video, index) => (
        <VideoCard
          key={index}
          item={video}
          size={isMobile ? "mobile" : "default"}
        />
      ))}
    </div>
  );
};

export default SearchView;
