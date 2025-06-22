import { Skeleton } from "@/components/ui/skeleton";

const SingleVideoCard = () => {
  return (
    <div className="flex gap-2 w-full">
      <Skeleton className="h-[100px] lg:h-[150px] flex-1" />
      <div className="flex flex-col gap-2 w-[40%] lg:w-[50%] ">
        <Skeleton className="h-[30px] lg:h-[50px] w-[80%]" />
        <Skeleton className="h-[50px] lg:h-[80px] w-full" />
      </div>
    </div>
  );
};

const SearchViewSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 mx-auto w-[80%] md:w-[600px] lg:w-[800px]">
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
      <SingleVideoCard />
    </div>
  );
};

export default SearchViewSkeleton;
