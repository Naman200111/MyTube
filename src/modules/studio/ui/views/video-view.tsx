import VideoFormSection from "../sections/video-form-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return <VideoFormSection videoId={videoId} />;
};

export default VideoView;
