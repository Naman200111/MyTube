"use client";

import { Button } from "@/components/ui/button";
import PlaylistsSection from "../sections/playlists-section";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/modal";
import Input from "@/components/input";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export const PlaylistsView = () => {
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const utils = trpc.useUtils();

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      utils.playlists.getMany.invalidate();
      toast.success("Playlist created");
      setShowCreatePlaylistModal(false);
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <>
      <div className="max-w-[1440px] select-none overflow-hidden w-[95%] mx-auto">
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
          onSubmit={(values) => {
            if (values.name) {
              create.mutate({ name: values.name as string });
            }
          }}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="font-bold text-lg">Create Playlist</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">Name</p>
              <Input className="pl-2" name="name" />
            </div>
            <Button
              className="self-end"
              size="sm"
              type="submit"
              disabled={create.isPending}
              // onClick={() => create.mutate({ name: form.name })}
            >
              Save
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
