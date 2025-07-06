import TrendingSection from "../sections/trending-section";

export const TrendingView = () => {
  return (
    <div className="max-w-[768px] select-none overflow-hidden w-[100%] mx-auto">
      <div className="mx-2">
        <p className="text-2xl font-bold">Trending</p>
        <p className="text-sm text-muted-foreground">
          Most popular videos at the moment
        </p>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2"></div>
      <TrendingSection />
    </div>
  );
};
