import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { Circle, CircleCheckIcon } from "lucide-react";

type userPlaylistsType = inferProcedureOutput<
  AppRouter["playlists"]["getMany"]
>;

interface AddToPlaylistModalProps {
  onClose: () => void;
  open: boolean;
  userPlaylists: userPlaylistsType["userPlaylists"];
  disabled: boolean;
  onClick: (playlistId: string, videoId: string) => void;
  videoId: string;
}

const AddToPlaylistModal = ({
  onClose,
  open,
  userPlaylists,
  disabled,
  onClick,
  videoId,
}: AddToPlaylistModalProps) => {
  return (
    <Modal onClose={onClose} open={open}>
      <div className="p-4 flex flex-col gap-4 max-h-[600px] min-w-[220px]">
        <div className="flex justify-between">
          <p className="font-semibold text-lg">Add to playlist</p>
        </div>
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
