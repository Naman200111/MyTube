import { PlaylistsView } from "@/modules/home/ui/views/playlists-view";
import { HydrateClient } from "@/trpc/server";

const LikedPage = () => {
  // void trpc.videos.getManyLiked.prefetchInfinite({
  //   limit: 10,
  // });
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
};

export default LikedPage;
