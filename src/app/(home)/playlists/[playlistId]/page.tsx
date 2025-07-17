import { PlaylistView } from "@/modules/home/ui/views/playlist-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PlaylistPageParams {
  params: Promise<{ playlistId: string }>;
}

const PlaylistPage = async ({ params }: PlaylistPageParams) => {
  const { playlistId } = await params;
  void trpc.playlists.getOne.prefetch({ playlistId });
  return (
    <HydrateClient>
      <PlaylistView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default PlaylistPage;
