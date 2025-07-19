"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { Modal } from "@/components/modal";
import { Loader2Icon } from "lucide-react";

interface VideoUploadModalProps {
  open: boolean;
  onClose: () => void;
  endpoint: string | undefined;
  onSuccess: () => void;
}

const VideoUploadModal = ({
  open,
  onClose,
  endpoint,
  onSuccess,
}: VideoUploadModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="min-h-[200px] min-w-[400px]"
    >
      <div className="mx-6 my-4">
        <p className="font-semibold text-xl mb-4">Upload a video</p>
        {endpoint ? (
          <MuxUploader
            endpoint={endpoint}
            onSuccess={onSuccess}
            className="mb-8"
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </div>
    </Modal>
  );
};

export default VideoUploadModal;
