"use client";

import { useRouter } from "next/navigation";
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
import { useState } from "react";

const VideoUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [muxUploaderVisibility, setMuxUploaderVisibility] = useState(false);

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate();
      toast.success("Video created successfully");
    },
    onError: () => {
      toast.error("Failed to create video");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={() => {
            create.mutate();
            setMuxUploaderVisibility(true);
          }}
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
      {muxUploaderVisibility ? (
        <DialogContent>
          <DialogTitle>Upload Video</DialogTitle>
          <MuxUploader
            endpoint={create.data?.url}
            onSuccess={() => {
              router.push(`/studio/videos/${create.data?.video?.id}`);
              setMuxUploaderVisibility(false);
            }}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default VideoUploadModal;
