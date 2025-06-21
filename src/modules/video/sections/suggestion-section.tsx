"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoSuggestion from "../components/video-suggestion";
import InfiniteScroll from "@/components/infinite-scroll";

interface SuggestionSectionProps {
  videoId: string;
}

export const SuggestionSection = ({ videoId }: SuggestionSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SuggestionSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SuggestionSectionSuspense = ({ videoId }: SuggestionSectionProps) => {
  const [data, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    { videoId, limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );

  const { hasNextPage, fetchNextPage, isFetchingNextPage } = query;
  const pages = data.pages;
  const items = pages.flatMap((page) => page.items) || [];

  return (
    <>
      {items.map((item, index) => (
        <VideoSuggestion key={index} item={item} />
      ))}
      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default SuggestionSection;
