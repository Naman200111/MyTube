import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const TrendingPage = () => {
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: 10,
  });
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default TrendingPage;
