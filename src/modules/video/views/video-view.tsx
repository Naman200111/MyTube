import CommentSection from "../sections/comments-section";
import SuggestionSection from "../sections/suggestion-section";
import VideoSection from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col gap-4 max-w-[1440px] p-2 lg:px-6 lg:flex-row overflow-hidden w-full mx-auto">
      <div className="flex flex-col gap-4 lg:flex-1">
        <VideoSection videoId={videoId} />
        <CommentSection videoId={videoId} />
      </div>
      <div className="lg:w-[35%] xl:w-[30%] 2xl:w-[25%]">
        <SuggestionSection videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoView;
