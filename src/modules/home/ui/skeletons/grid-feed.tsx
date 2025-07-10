import { Skeleton } from "@/components/ui/skeleton";

const VideoGridCardSkeleton = () => {
  return <Skeleton className="h-[180px] m-2" />;
};

const GridFeedViewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

export default GridFeedViewSkeleton;
