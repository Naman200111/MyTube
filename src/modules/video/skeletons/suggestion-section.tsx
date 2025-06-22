import { Skeleton } from "@/components/ui/skeleton";

const SuggestionSectionSkeleton = () => {
  return (
    <>
      <Skeleton className="h-[150px] mb-5 lg:mx-1 lg:mb-2" />
      <Skeleton className="h-[150px] mb-5 lg:mx-1 lg:mb-2" />
      <Skeleton className="h-[150px] mb-5 lg:mx-1 lg:mb-2" />
      <Skeleton className="h-[150px] mb-5 lg:mx-1 lg:mb-2" />
      <Skeleton className="h-[150px] mb-5 lg:mx-1 lg:mb-2" />
    </>
  );
};

export default SuggestionSectionSkeleton;
