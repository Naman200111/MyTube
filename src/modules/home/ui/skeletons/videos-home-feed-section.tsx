import { Skeleton } from "@/components/ui/skeleton";

const VideoGridCardSkeleton = () => {
  return <Skeleton className="h-[180px] m-2" />;
};

const VideosHomeFeedSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
      <VideoGridCardSkeleton />
    </div>
  );
};

export default VideosHomeFeedSkeleton;
