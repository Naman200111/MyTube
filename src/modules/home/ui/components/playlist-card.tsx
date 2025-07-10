import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
import { getShortFormDateFromDate } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { ListVideo } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type playlistType = inferProcedureOutput<AppRouter["playlists"]["getMany"]>;

interface PlaylistCardProps {
  playlist: playlistType["userPlaylists"][0];
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const videoCount = playlist?.videoCount || 0;
  const router = useRouter();

  const utils = trpc.useUtils();
  useClickOutside(() => setShowDropDown(false));

  const deletePlaylist = trpc.playlists.delete.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success("Playlist deleted");
      setShowDropDown(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div
      className="cursor-pointer h-[420px] xs:h-[300px] w-full flex flex-col gap-2 relative p-1 mb-4"
      onClick={() => router.push(`/playlists/${playlist.id}`)}
    >
      <div className="absolute top-[-6px] left-[20px] right-[20px]  h-[10%] bg-gray-300 rounded-lg z-0" />
      <div className="absolute top-[-1px] left-[8px] right-[8px]  h-[10%] bg-gray-400 rounded-lg z-10" />
      <div className="relative h-full rounded-xl overflow-hidden z-20">
        <div className="absolute rounded-md p-1 bottom-2 right-2 bg-foreground text-background text-xs z-10 flex gap-1">
          <ListVideo size={16} />
          <p>{videoCount} videos</p>
        </div>
        <Image
          fill
          src={playlist.topVideoThumbnail || "/placeholder.svg"}
          alt="Playlist"
          className="object-cover"
        />
      </div>
      <div className="ml-1">
        <div className="flex justify-between">
          <div className="font-semibold line-clamp-1">{playlist.name}</div>
          <DropDownTrigger
            onClick={(e) => {
              e.stopPropagation();
              setShowDropDown(true);
            }}
            className="mt-1"
          >
            {showDropDown ? (
              <DropDownItem
                disabled={deletePlaylist.isPending}
                onClick={() =>
                  deletePlaylist.mutate({ playlistId: playlist.id })
                }
              >
                Delete playlist
              </DropDownItem>
            ) : null}
          </DropDownTrigger>
        </div>
        <div className="text-muted-foreground text-sm my-1">
          <p>Playlist</p>
          <p>Updated {getShortFormDateFromDate(playlist.updatedAt)}</p>
          <p className="font-semibold mt-1">View full playlist</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
