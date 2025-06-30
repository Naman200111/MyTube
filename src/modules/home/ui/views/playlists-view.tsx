"use client";

import { Button } from "@/components/ui/button";
import PlaylistsSection from "../sections/playlists-section";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import Input from "@/components/input";

export const PlaylistsView = () => {
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    // if (form && form.name) {
    // }
  }, [form]);

  return (
    <>
      <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
        <div className="w-full flex justify-between items-center">
          <div className="mx-2">
            <p className="text-2xl font-bold">Playlists</p>
            <p className="text-sm text-muted-foreground">
              Your custom playlists
            </p>
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
      {showCreatePlaylistModal && (
        <Modal
          onClose={() => setShowCreatePlaylistModal(false)}
          open={showCreatePlaylistModal}
          className="w-[400px]"
          onSubmit={setForm}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold text-lg">Create Playlist</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Name</p>
              <Input className="p-1" name="name" />
            </div>
            <Button className="self-end" size="sm" type="submit">
              Save
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
