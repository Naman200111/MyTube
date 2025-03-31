import { VideosSection } from "../sections/videos-section";

const StudioView = () => {
  return (
    <div className="w-full max-w-[1440px]">
      <div className="text-3xl px-6 pt-6 pb-4">Channel Content</div>
      <VideosSection />
    </div>
  );
};

export default StudioView;
