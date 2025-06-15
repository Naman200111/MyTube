interface VideoPlayerProps {
  playbackId: string | null;
  autoPlay?: boolean;
  className?: string;
  onPlay: () => void;
}
import { mergeClasses } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({
  playbackId,
  autoPlay = false,
  onPlay,
  className,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      className={mergeClasses(
        "aspect-video overflow-hidden rounded-md",
        className
      )}
      placeholder="/placeholder.svg"
      playerInitTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      playbackId={playbackId || ""}
    />
  );
};

export default VideoPlayer;
