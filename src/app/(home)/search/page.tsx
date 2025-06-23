import SearchView from "@/modules/search/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

// export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{ query: string }>;
}

const SearchPage = async ({ params }: SearchPageProps) => {
  const params1 = await params;
  console.log(params1, "params1");
  const { query } = params1;
  void trpc.videos.getManyFromQuery.prefetchInfinite({ query, limit: 10 });

  console.log(query, "searhc query");
  return (
    <HydrateClient>
      <SearchView query={query} />
    </HydrateClient>
  );
};

export default SearchPage;
