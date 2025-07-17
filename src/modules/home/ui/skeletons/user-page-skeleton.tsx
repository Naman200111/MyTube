import { Skeleton } from "@/components/ui/skeleton";

const UserPage = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <Skeleton className="w-full h-[200px] rounded-xl overflow-hidden" />
      <div className="flex gap-6 mt-4">
        <Skeleton className="rounded-full h-[150px] w-[150px]" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-6 w-[180px]" />
          <Skeleton className="h-8 w-[120px] mt-8" />
        </div>
      </div>
      <Skeleton className="rounded-xl w-full h-[300px] mt-10" />
    </div>
  );
};

const UserPageSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-[100%] max-w-[960px] gap-2">
      <UserPage />
    </div>
  );
};

export default UserPageSkeleton;
