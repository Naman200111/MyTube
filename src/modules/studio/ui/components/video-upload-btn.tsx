"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, Plus } from "lucide-react";
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
  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? <Loader2Icon className="animate-spin" /> : <Plus />}
      Create
    </Button>
  );
};

export default VideoUploadModal;
