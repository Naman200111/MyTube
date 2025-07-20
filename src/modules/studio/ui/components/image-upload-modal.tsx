import { Modal } from "@/components/modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  videoId: string;
  showClose?: boolean;
}

const ImageUploadModal = ({
  open,
  onClose,
  videoId,
}: ImageUploadModalProps) => {
  const utils = trpc.useUtils();

  const handleThumbnailUploadComplete = () => {
    utils.studio.getOne.invalidate({ videoId });
    utils.studio.getMany.invalidate();
    toast.message("Thumbnail Changed");
    onClose();
  };

  const handleThumbnailUploadFail = () => {
    toast.message("Thumbnail upload failed");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="min-h-[100px] overflow-hidden p-5"
    >
      <UploadDropzone
        endpoint="imageUploader"
        className="cursor-pointer"
        input={{ videoId }}
        onClientUploadComplete={handleThumbnailUploadComplete}
        onUploadError={handleThumbnailUploadFail}
        onUploadAborted={handleThumbnailUploadFail}
      />
    </Modal>
  );
};

export default ImageUploadModal;
