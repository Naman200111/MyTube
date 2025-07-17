"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dot, PencilIcon, Trash2Icon } from "lucide-react";
import BannerUploadModal from "../components/banner-upload-modal";
import { toast } from "sonner";
import UserAvatar from "@/components/user-avatar";
import { getCountShortForm } from "@/lib/utils";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import UserPageSkeleton from "../skeletons/user-page-skeleton";
import { useIsMobileSmall } from "@/hooks/use-mobile-small";
import VideoCard from "@/modules/video/components/video-card";
import InfiniteScroll from "@/components/infinite-scroll";

interface UserPageSectionProps {
  userId: string;
}

const UserPageSection = ({ userId }: UserPageSectionProps) => {
  return (
    <Suspense fallback={<UserPageSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to load user page...</p>}>
        <UserPageSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserPageSectionSuspense = ({ userId }: UserPageSectionProps) => {
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const isMobile = useIsMobileSmall();

  const [userPageData] = trpc.users.getOne.useSuspenseQuery({ userId });
  const [userVideosData, query] =
    trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
      { userId, limit: 5 },
      { getNextPageParam: (lastPage) => lastPage.cursor }
    );

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const videoPages = userVideosData.pages;
  const [bannerUploadModalOpen, setBannerUploadModalOpen] = useState(false);

  const removeBanner = trpc.users.removeBanner.useMutation({
    onSuccess: () => {
      utils.users.getOne.invalidate({ userId });
      toast.message("Banner removed");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      utils.users.getOne.invalidate({ userId });
      utils.subscriptions.getMany.invalidate();
      toast.message("Subscribed");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Something went wrong");
    },
  });
  const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => {
      utils.users.getOne.invalidate({ userId });
      utils.subscriptions.getMany.invalidate();
      toast.message("Unsubscribed");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }
      toast.error("Something went wrong");
    },
  });

  const handleSubUnSubClick = () => {
    if (userPageData.isViewerSubscriber) {
      unsubscribe.mutate({ creatorId: userId });
    } else {
      subscribe.mutate({ creatorId: userId });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full h-[200px] xs:rounded-xl overflow-hidden relative">
        {userPageData.bannerUrl ? (
          <Image fill src={userPageData.bannerUrl} alt="banner-poster" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        {userPageData.isViewerCreator ? (
          <div className="flex">
            <Button
              className="absolute top-2 right-2 rounded-full bg-white"
              variant="ghost"
              size="icon"
              disabled={removeBanner.isPending}
              onClick={() => setBannerUploadModalOpen(true)}
            >
              <PencilIcon />
            </Button>
            {userPageData.bannerUrl ? (
              <Button
                className="absolute right-12 top-2 rounded-full bg-white"
                variant="ghost"
                size="icon"
                disabled={removeBanner.isPending}
                onClick={() => {
                  removeBanner.mutate();
                }}
              >
                <Trash2Icon />
              </Button>
            ) : null}
          </div>
        ) : null}
        <BannerUploadModal
          open={bannerUploadModalOpen}
          onClose={() => setBannerUploadModalOpen(false)}
          userId={userPageData.id}
        />
      </div>
      <div className="w-full mx-2 xs:m-0">
        <div className="flex gap-3 xs:gap-6 mt-4 items-center">
          <UserAvatar
            size={isMobile ? "xxl" : "xxxl"}
            imageUrl={userPageData.imageUrl}
            className="min-w-[100px]"
          />
          <div className="flex flex-col gap-1 xs:gap-2">
            <p className="font-bold text-xl xs:text-3xl">{userPageData.name}</p>
            <div className="flex gap-1 text-muted-foreground text-xs items-center">
              <p>
                {getCountShortForm(userPageData.subscribersCount)} subscribers
              </p>
              <Dot className="mx-[-8px]" />
              <p>{getCountShortForm(userPageData.videosCount)} videos</p>
            </div>
            {userPageData.isViewerCreator ? (
              <Link href="/studio">
                <Button className="rounded-lg">Go to Studio</Button>
              </Link>
            ) : (
              <Button
                className="p-1 w-[100px] cursor-pointer text-xs"
                disabled={subscribe.isPending || unsubscribe.isPending}
                onClick={() => handleSubUnSubClick()}
                size="sm"
              >
                {userPageData.isViewerSubscriber ? "Unsubscribe" : "Subscribe"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 mt-6 xs:px-2">
        {videoPages
          .flatMap((page) => page.items)
          .map((video, index) => (
            <VideoCard
              key={index}
              item={video}
              size={isMobile ? "mobile" : "grid"}
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default UserPageSection;
