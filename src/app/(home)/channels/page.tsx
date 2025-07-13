import ChannelsView from "@/modules/home/ui/views/channels-view";
import { HydrateClient, trpc } from "@/trpc/server";

const ChannelsPage = () => {
  void trpc.subscriptions.getMany.prefetch();
  return (
    <HydrateClient>
      <ChannelsView />
    </HydrateClient>
  );
};

export default ChannelsPage;
