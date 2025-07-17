import { LikedView } from "@/modules/home/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const LikedPage = () => {
  void trpc.videos.getManyLiked.prefetchInfinite({
    limit: 10,
  });
  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
};

export default LikedPage;
