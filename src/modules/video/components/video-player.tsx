interface VideoPlayerProps {
  playbackId: string | null;
  autoPlay?: boolean;
  className?: string;
  thumbnailURL?: string | null;
  onPlay: () => void;
}
import { mergeClasses } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";

const VideoPlayer = ({
  playbackId,
  autoPlay = false,
  onPlay,
  className,
  thumbnailURL,
}: VideoPlayerProps) => {
  console.log(thumbnailURL, "thumbnailURL");
  return (
    <MuxPlayer
      className={mergeClasses(
        "aspect-video overflow-hidden rounded-md",
        className
      )}
      poster={thumbnailURL || "/placeholder.svg"}
      playerInitTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      playbackId={playbackId || ""}
    />
  );
};

export default VideoPlayer;
