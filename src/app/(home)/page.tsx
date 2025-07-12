import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

export default async function Home() {
  void trpc.categories.getMany.prefetch();
  void trpc.subscriptions.getMany.prefetch();
  void trpc.videos.getManyFromQuery.prefetchInfinite({
    limit: 12,
  });

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
}
