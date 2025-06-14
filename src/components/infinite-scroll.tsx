import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useState } from "react";

interface InfiniteScrollProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  manual?: boolean;
}

const InfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  manual = false,
}: InfiniteScrollProps) => {
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const { observerRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      isIntersecting &&
      (showMoreClicked || !manual)
    )
      fetchNextPage();
    setShowMoreClicked(false);
  }, [
    isIntersecting,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    showMoreClicked,
    manual,
  ]);

  return (
    <div ref={observerRef} className="flex justify-center my-10 text-gray-500">
      {hasNextPage ? (
        manual ? (
          <p
            className="cursor-pointer"
            onClick={() => setShowMoreClicked(true)}
          >
            {isFetchingNextPage ? <>Loading...</> : <>Show More</>}
          </p>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>End of the List</p>
      )}
    </div>
  );
};

export default InfiniteScroll;
