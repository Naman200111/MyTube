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
  const { data: playlistData, isLoading } =
    trpc.playlists.getManyForVideo.useQuery(
      { videoId },
      {
        enabled: !!videoId && open,
      }
    );
  const userPlaylists = playlistData?.userPlaylists ?? [];

  return (
    <Modal onClose={onClose} open={open}>
      <div className="p-4 flex flex-col gap-2 max-h-[600px] min-w-[220px]">
        <div className="flex justify-between">
          <p className="font-semibold text-lg ml-2">Add to playlist</p>
        </div>
        {isLoading ? <Loader2Icon className="animate-spin mx-auto" /> : null}
        {userPlaylists.map((playlist, index) => {
          return (
            <Button
              variant="ghost"
              disabled={disabled}
              className="w-full flex justify-start px-2"
              key={index}
              onClick={() => onClick(playlist.id, videoId)}
            >
              {playlist.videoInPlaylist ? <CircleCheckIcon /> : <Circle />}
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
