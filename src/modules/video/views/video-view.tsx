import VideoSection from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return <VideoSection videoId={videoId} />;
};

export default VideoView;
