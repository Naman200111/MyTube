"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VerticalFeedViewSkeleton from "../skeletons/vertical-feed";
import { trpc } from "@/trpc/client";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
// import { toast } from "sonner";

const ChannelsSection = () => {
  return (
    <Suspense fallback={<VerticalFeedViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load your subscriptions...</p>}>
        <ChannelsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelsSectionSuspense = () => {
  const isMobile = useIsMobileSmall();
  // const utils = trpc.useUtils();
  const [subscriptionsData] = trpc.subscriptions.getMany.useSuspenseQuery();

  // todo add this
  // const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
  //     onSuccess: () => {
  //       utils.subscriptions.getMany.invalidate();
  //     },
  //     onError: () => {
  //       toast.error("Something went wrong");
  //     },
  //   });

  return (
    <div className="flex flex-col w-[100%] max-w-[720px] gap-6 justify-center px-2">
      {subscriptionsData.map((subscriptionData, index) => (
        <div className="flex justify-between items-center" key={index}>
          <div className="flex gap-2 xs:gap-4 items-center">
            <UserAvatar
              size={isMobile ? "lg" : "xl"}
              imageUrl={
                subscriptionData.creator.imageUrl || "user-placeholder.svg"
              }
            />
            <div>
              <p>{subscriptionData.creator.name}</p>
              <p>{}</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="bg-muted rounded-xl">
            Unsubscribe
          </Button>
        </div>
        // onClick={() => unsubscribe.mutate()}>
      ))}
      <div className="self-center text-muted-foreground">End of the list</div>
    </div>
  );
};

export default ChannelsSection;
