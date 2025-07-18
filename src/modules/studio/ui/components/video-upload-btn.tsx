"use client";

import MuxUploader from "@mux/mux-uploader-react";
import { Modal } from "@/components/modal";

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
    <Modal open={open} onClose={onClose}>
      <div className="p-8">
        <MuxUploader endpoint={endpoint} onSuccess={onSuccess} />
      </div>
    </Modal>
  );
};

export default VideoUploadModal;
