import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { trpc } from "@/trpc/client";
// import VideoCard from "@/modules/video/components/video-card";
// import InfiniteScroll from "@/components/infinite-scroll";
import GridFeedViewSkeleton from "../skeletons/grid-feed";

const PlaylistsSection = () => {
  return (
    <Suspense fallback={<GridFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load your custom playlists...</p>}>
        <PlaylistsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistsSectionSuspense = () => {
  // const [playlistData, query] = trpc.videos.getManyPlaylists.useSuspenseInfiniteQuery(
  //   { limit: 10 },
  //   { getNextPageParam: (lastPage) => lastPage.cursor }
  // );

  // const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  // const pages = playlistData.pages;
  // const playlists = pages.flatMap((page) => page.items) || [];
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-2">
        {/* {playlists.map((video, index) => (
          <VideoCard key={index} item={video} variant="feed" />
        ))} */}
        Playlists
      </div>
      {/* <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      /> */}
    </>
  );
};

export default PlaylistsSection;
