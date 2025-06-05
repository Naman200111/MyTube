interface VideoPlayerProps {
  playbackId: string | null;
  autoPlay: boolean;
}
import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({ playbackId, autoPlay }: VideoPlayerProps) => {
  return (
    <MuxPlayer
      className="aspect-video"
      placeholder="/placeholder.svg"
      playerInitTime={0}
      autoPlay={autoPlay}
      playbackId={playbackId || ""}
    />
  );
};

export default VideoPlayer;
