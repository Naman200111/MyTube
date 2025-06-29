import TrendingSection from "../sections/trending-section";

export const TrendingView = () => {
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      <div className="">
        <p className="text-2xl font-bold">Trending</p>
        <p className="text-sm text-muted-foreground">
          Most popular videos at the moment
        </p>
      </div>
      <div className="h-[1px] bg-gray-200 my-6 mx-2"></div>
      <TrendingSection />
    </div>
  );
};
