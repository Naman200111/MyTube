import StudioView from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

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
