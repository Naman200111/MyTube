"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { trpc } from "@/trpc/client";
// import VideoCard from "@/modules/video/components/video-card";
// import InfiniteScroll from "@/components/infinite-scroll";
import GridFeedViewSkeleton from "../skeletons/grid-feed";
import { trpc } from "@/trpc/client";
import PlaylistCard from "../components/playlist-card";

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
  console.log("will call getmany 1");
  const [playlistData] = trpc.playlists.getMany.useSuspenseQuery();
  const { userPlaylists } = playlistData;
  // const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-2">
        {userPlaylists.map((playlist, index) => (
          <PlaylistCard
            key={index}
            playlist={playlist}
            // thumbnailURLPlaylist={thumbnailURLPlaylist}
          />
        ))}
      </div>
      <div className="mt-8 text-muted-foreground flex justify-center">
        End of the list
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
