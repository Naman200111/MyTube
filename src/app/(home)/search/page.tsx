import SearchView from "@/modules/search/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface SearchPageProps {
  params: Promise<{ query: string }>;
}

const SearchPage = async ({ params }: SearchPageProps) => {
  const { query } = await params;
  void trpc.videos.getManyFromQuery.prefetchInfinite({ query, limit: 10 });

  console.log(query, "searhc query");
  return (
    <HydrateClient>
      <SearchView query={query} />
    </HydrateClient>
  );
};

export default SearchPage;
