import { VideosSection } from "../sections/videos-section";

const StudioView = () => {
  return (
    <div className="w-full">
      <div className="text-3xl px-6 pt-6 pb-4">Channel Content</div>
      <div className="h-[1px] w-full bg-slate-200"></div>
      <VideosSection />
    </div>
  );
};

export default StudioView;
