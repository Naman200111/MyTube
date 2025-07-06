import PlaylistSection from "../sections/playlist-section";

interface PlaylistViewProps {
  playlistId: string;
}

export const PlaylistView = ({ playlistId }: PlaylistViewProps) => {
  return (
    <div className="max-w-[1280px] select-none overflow-hidden w-[100%] flex justify-center mx-auto">
      <PlaylistSection playlistId={playlistId} />
    </div>
  );
};
