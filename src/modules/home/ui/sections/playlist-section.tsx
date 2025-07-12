"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { trpc } from "@/trpc/client";
// import VideoCard from "@/modules/video/components/video-card";
// import InfiniteScroll from "@/components/infinite-scroll";
import { trpc } from "@/trpc/client";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import VideoCard from "@/modules/video/components/video-card";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import DeleteModal from "@/modules/video/components/delete-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import PlaylistCard from "../components/playlist-card";

interface PlaylistSectionProps {
  playlistId: string;
}

const PlaylistSection = ({ playlistId }: PlaylistSectionProps) => {
  return (
    <Suspense fallback={<VerticalFeedViewSkeleton />}>
      <ErrorBoundary
        fallback={<p>Failed to load your custom playlist videos...</p>}
      >
        <PlaylistSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistSectionSuspense = ({ playlistId }: PlaylistSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [playlistData] = trpc.playlists.getOne.useSuspenseQuery({ playlistId });
  const deletePlaylist = trpc.playlists.delete.useMutation({
    onSuccess: () => {
      setDeleteModalOpen(false);
      router.push("/playlists");
      utils.playlists.getMany.invalidate();
      toast.message("Playlist removed");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const {
    userPlaylist: { playlistName },
    videos: userPlaylistVideos,
  } = playlistData;
  // const { playlistName } = userPlaylistVideos[
  const isMobile = useIsMobileSmall();

  // const { fetchNextPage, isFetchingNextPage, hasNextPage } = query;

  // const pages = playlistData.pages;
  // const playlists = pages.flatMap((page) => page.items) || [];
  return (
    <div className="flex flex-col w-[100%] max-w-[720px] gap-2">
      <div className="flex justify-between mx-2 items-center">
        <div>
          <p className="text-2xl font-bold">{playlistName}</p>
          <p className="text-muted-foreground text-sm">
            Your custom playlist videos at the moment
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border"
          onClick={() => setDeleteModalOpen(true)}
        >
          <Trash2Icon color="red" />
        </Button>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2 w-[100%]"></div>
      {userPlaylistVideos.map((video, index) => (
        <VideoCard
          key={index}
          item={video}
          variant="feed"
          size={isMobile ? "mobile" : "default"}
        />
      ))}
      <div className="mt-8 text-muted-foreground flex justify-center">
        End of the list
      </div>
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        entity="playlist"
        disabled={deletePlaylist.isPending}
        onOk={() => {
          deletePlaylist.mutate({ playlistId });
        }}
      />
    </div>
  );
};

export default PlaylistSection;
