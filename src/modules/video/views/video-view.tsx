import CommentsSection from "../sections/comments-section";
import SuggestionSection from "../sections/subscription-section";
import VideoSection from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col gap-4 flex-1 mx-auto max-w-[1440px] p-2 lg:px-6 lg:flex-row">
      <div className="flex flex-col gap-4 lg:w-[70%]">
        <VideoSection videoId={videoId} />
        <CommentsSection />
      </div>
      <SuggestionSection />
    </div>
  );
};

export default VideoView;
