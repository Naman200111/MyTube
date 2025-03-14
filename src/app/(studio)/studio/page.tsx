import StudioView from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

const StudioPage = () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: 5,
  });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default StudioPage;
