import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type playlistType = inferProcedureOutput<AppRouter["playlists"]["getMany"]>;

interface PlaylistCardProps {
  playlist: playlistType["userPlaylists"][0];
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  // const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  const utils = trpc.useUtils();
  useClickOutside(() => setShowDropDown(false));

  const deletePlaylist = trpc.playlists.delete.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success("Playlist deleted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div
      className="cursor-pointer h-[260px] w-full flex flex-col gap-1"
      // onClick={onClick}
    >
      <div className="relative h-full rounded-md overflow-hidden">
        <Image fill src="/placeholder.svg" alt="Playlist" />
      </div>
      <div className="flex justify-between">
        <div>{playlist.name}</div>
        <div className="flex justify-between">
          <DropDownTrigger
            onClick={(e) => {
              e.stopPropagation();
              setShowDropDown(!showDropDown);
            }}
            className="mt-1"
          >
            {showDropDown ? (
              <DropDownItem
                onClick={() => deletePlaylist.mutate({ name: playlist.name })}
              >
                Delete playlist
              </DropDownItem>
            ) : null}
          </DropDownTrigger>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
