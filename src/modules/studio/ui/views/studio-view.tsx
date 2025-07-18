import { VideosSection } from "../sections/videos-section";

const StudioView = () => {
  return (
    <div className="max-w-[1440px] overflow-hidden w-full">
      <div className="text-3xl px-2 xs:px-6 pt-6 pb-4">Channel Content</div>
      <VideosSection />
    </div>
  );
};

export default StudioView;
