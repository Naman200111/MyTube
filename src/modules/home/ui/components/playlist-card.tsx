import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import useClickOutside from "@/hooks/use-click-outside";
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
  thumbnailURLPlaylist?: string | null;
}

const PlaylistCard = ({
  playlist,
  thumbnailURLPlaylist,
}: PlaylistCardProps) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const videoCount = playlist.videoIds.filter((videoId) => videoId).length || 0;
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
      className="cursor-pointer h-[220px] w-full flex flex-col gap-2 relative"
      onClick={() => router.push(`/playlists/${playlist.id}`)}
    >
      <div className="absolute top-[-6px] left-[20px] right-[20px]  h-[10%] bg-gray-300 rounded-lg z-0" />
      <div className="absolute top-[-3px] left-[8px] right-[8px]  h-[10%] bg-gray-400 rounded-lg z-10" />
      <div className="relative h-full rounded-xl overflow-hidden z-20">
        <div className="absolute rounded-md p-1 bottom-2 right-2 bg-foreground text-background text-xs z-10 flex gap-1">
          <ListVideo size={16} />
          <p>{videoCount} videos</p>
        </div>
        <Image
          fill
          src={thumbnailURLPlaylist || "/placeholder.svg"}
          alt="Playlist"
          className="object-cover"
        />
      </div>
      <div className="flex justify-between">
        <div className="font-semibold ml-1 line-clamp-1">{playlist.name}</div>
        <div className="flex justify-between">
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
      </div>
    </div>
  );
};

export default PlaylistCard;
