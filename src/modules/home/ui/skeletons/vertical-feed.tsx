import { Skeleton } from "@/components/ui/skeleton";

const SingleVideoCard = () => {
  return (
    <div className="flex gap-2 w-full">
      <Skeleton className="h-[120px] w-[30%]" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[50px]" />
      </div>
    </div>
  );
};

const VerticalFeedViewSkeleton = () => {
  return (
    <div className="flex flex-col items-center mx-2 w-[60%] ml-10 max-w-[1080px] gap-2">
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
    </div>
  );
};

export default VerticalFeedViewSkeleton;
