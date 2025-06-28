import { CategorySection } from "../sections/category-section";
import VideosHomeFeedSection from "../sections/videos-home-feed-section";

export const HomeView = () => {
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      <CategorySection />
      <VideosHomeFeedSection />
    </div>
  );
};
