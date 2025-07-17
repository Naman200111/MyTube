import { PlaylistsView } from "@/modules/home/ui/views/playlists-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const PlaylistPage = () => {
  void trpc.playlists.getMany.prefetch();
  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
};

export default PlaylistPage;
