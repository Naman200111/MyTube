import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";

interface InfiniteScrollProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const InfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: InfiniteScrollProps) => {
  const { observerRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && isIntersecting) fetchNextPage();
  }, [isIntersecting, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <div ref={observerRef} className="flex justify-center my-10 text-gray-500">
      {hasNextPage ? <p>Show More</p> : <p>End of the List</p>}
    </div>
  );
};

export default InfiniteScroll;
