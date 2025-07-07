import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Circle, CircleCheckIcon, Loader2Icon } from "lucide-react";

interface AddToPlaylistModalProps {
  onClose: () => void;
  open: boolean;
  disabled: boolean;
  onClick: (playlistId: string, videoId: string) => void;
  videoId: string;
}

const AddToPlaylistModal = ({
  onClose,
  open,
  disabled,
  onClick,
  videoId,
}: AddToPlaylistModalProps) => {
  // second option helps me in running this query only when modal opens and not when rendered
  const { data: playlistData, isLoading } = trpc.playlists.getMany.useQuery(
    undefined,
    {
      enabled: !!videoId && open,
    }
  );
  const userPlaylists = playlistData?.userPlaylists ?? [];

  return (
    <Modal onClose={onClose} open={open}>
      <div className="p-4 flex flex-col gap-4 max-h-[600px] min-w-[220px]">
        <div className="flex justify-between">
          <p className="font-semibold text-lg">Add to playlist</p>
        </div>
        {isLoading ? <Loader2Icon className="animate-spin mx-auto" /> : null}
        {userPlaylists.map((playlist, index) => {
          const videos = playlist.videoIds;
          const videoInPlaylist = videos.some(
            (videoInPlaylist) => videoInPlaylist === videoId
          );
          return (
            <Button
              variant="ghost"
              disabled={disabled}
              className="w-full gap-2 px-2 lg:px-4 flex justify-start"
              key={index}
              onClick={() => onClick(playlist.id, videoId)}
            >
              {videoInPlaylist ? <CircleCheckIcon /> : <Circle />}
              <div className="overflow-hidden line-clamp-1 justify-self-start">
                {playlist.name}
              </div>
            </Button>
          );
        })}
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
