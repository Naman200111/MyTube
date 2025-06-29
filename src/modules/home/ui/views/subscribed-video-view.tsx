import SubscribedVideosSection from "../sections/subscribed-video-section";

export const SubscribedVideosView = () => {
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      <div className="mx-2">
        <p className="text-2xl font-bold">Latest</p>
        <p className="text-sm text-muted-foreground">
          Your favourite channed videos at the moment
        </p>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2"></div>
      <SubscribedVideosSection />
    </div>
  );
};
