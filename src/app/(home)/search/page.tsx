import SearchView from "@/modules/home/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface SearchPageProps {
  searchParams: { query?: string };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams;
  void trpc.videos.getManyFromQuery.prefetchInfinite({ query, limit: 10 });

  return (
    <HydrateClient>
      <SearchView searchQuery={query} />
    </HydrateClient>
  );
};

export default SearchPage;
