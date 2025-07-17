import { SubscribedVideosView } from "@/modules/home/ui/views/subscribed-video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const SubscribedVideosPage = () => {
  void trpc.videos.getManySubscribed.prefetchInfinite({
    limit: 12,
  });
  return (
    <HydrateClient>
      <SubscribedVideosView />
    </HydrateClient>
  );
};

export default SubscribedVideosPage;
