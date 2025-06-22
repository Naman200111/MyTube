import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SearchViewSkeleton from "../skeletons/search-view";
import { trpc } from "@/trpc/client";

interface SearchViewProps {
  query: string;
}

const SearchView = ({ query }: SearchViewProps) => {
  return (
    <Suspense fallback={<SearchViewSkeleton />}>
      <ErrorBoundary fallback={<p>Failed to fetch results..</p>}>
        <SearchViewSuspense query={query} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SearchViewSuspense = ({ query }: SearchViewProps) => {
  console.log(query, "query");
  const [searchedData] = trpc.videos.getManyFromQuery.useSuspenseInfiniteQuery(
    { query, limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.cursor }
  );
  return (
    <div>
      Searched query: {query} : {JSON.stringify(searchedData)}
    </div>
  );
};

export default SearchView;
