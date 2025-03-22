"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/trpc/client";
import { Loader2Icon, Plus } from "lucide-react";
import MuxUploader from "@mux/mux-uploader-react";
import { toast } from "sonner";

const VideoUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video created successfully");
    },
    onError: () => {
      toast.error("Failed to create video");
    },
  });

  console.log(create, "create");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={() => create.mutate()}
          disabled={create.isPending}
        >
          {create.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Plus />
          )}
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload Video</DialogTitle>
        <MuxUploader
          endpoint={create.data?.url}
          // onUploadStart={() => create.mutate()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
