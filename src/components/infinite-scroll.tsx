import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect, useState } from "react";

interface InfiniteScrollProps {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  endMessage?: string;
  manual?: boolean;
}

const InfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  endMessage = "End of the List",
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
    <div
      ref={observerRef}
      className="flex justify-center my-4 text-muted-foreground"
    >
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
        <p>{endMessage}</p>
      )}
    </div>
  );
};

export default InfiniteScroll;
