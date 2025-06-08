interface VideoPlayerProps {
  playbackId: string | null;
  autoPlay?: boolean;
  onPlay: () => void;
}
import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({
  playbackId,
  autoPlay = false,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      className="aspect-video"
      placeholder="/placeholder.svg"
      playerInitTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      playbackId={playbackId || ""}
    />
  );
};

export default VideoPlayer;
