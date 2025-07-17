import { HistoryView } from "@/modules/home/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const HistoryPage = () => {
  void trpc.videos.getManyHistory.prefetchInfinite({
    limit: 10,
  });
  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default HistoryPage;
