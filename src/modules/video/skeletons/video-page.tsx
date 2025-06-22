import { Skeleton } from "@/components/ui/skeleton";

const VideoPageSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[200px] lg:h-[500px]" />
      <Skeleton className="h-10" />
      <Skeleton className="h-[100px] lg:h-[200px]" />
    </>
  );
};

export default VideoPageSkeleton;
