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
      <div></div>
      <MuxUploader endpoint={endpoint} onSuccess={onSuccess} />
    </Modal>
  );
};

export default VideoUploadModal;
