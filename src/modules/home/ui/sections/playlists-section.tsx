"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
  const [playlistData] = trpc.playlists.getMany.useSuspenseQuery();
  const { userPlaylists } = playlistData;

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 xs:p-2">
        {userPlaylists.map((playlist, index) => (
          <PlaylistCard key={index} playlist={playlist} />
        ))}
      </div>
      <div className="mt-8 text-muted-foreground flex justify-center">
        End of the list
      </div>
    </>
  );
};

export default PlaylistsSection;
