"use client";

import { Button } from "@/components/ui/button";
import PlaylistsSection from "../sections/playlists-section";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/modal";
import { mergeClasses } from "@/lib/utils";

export const PlaylistsView = () => {
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      {/* <div
        className={mergeClasses(
          showCreatePlaylistModal
            ? "transition-opacity duration-300 pointer-events-none  brightness-50"
            : ""
        )}
      > */}
      <div className="w-full flex justify-between items-center">
        <div className="mx-2">
          <p className="text-2xl font-bold">Playlists</p>
          <p className="text-sm text-muted-foreground">Your custom playlists</p>
        </div>
        <Button
          className="rounded-full overflow-hidden border border-muted mr-6"
          variant="outline"
          size="icon"
          onClick={() => setShowCreatePlaylistModal(true)}
          popoverTarget="playlist_modal"
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2"></div>
      <PlaylistsSection />
    </div>
    //   <Modal
    //     title="Create Playlist"
    //     saveText="Create"
    //     onSave={() => {}}
    //     id="playlist_modal"
    //   />
    //   {/* )} */}
    // </div>
  );
};
