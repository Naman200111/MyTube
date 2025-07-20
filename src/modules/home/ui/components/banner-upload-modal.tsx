import { Modal } from "@/components/modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface BannerUploadModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  userId: string;
  showClose?: boolean;
}

const BannerUploadModal = ({
  open,
  onClose,
  userId,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();

  const handleBannerUploadComplete = () => {
    utils.users.getOne.invalidate({ userId });
    toast.message("Banner Changed");
    onClose();
  };

  const handleBannerUploadFail = () => {
    toast.message("Banner upload failed");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="min-h-[100px] p-5 overflow-hidden"
    >
      <UploadDropzone
        endpoint="bannerUploader"
        className="cursor-pointer"
        input={{ userId }}
        onClientUploadComplete={handleBannerUploadComplete}
        onUploadError={handleBannerUploadFail}
        onUploadAborted={handleBannerUploadFail}
      />
    </Modal>
  );
};

export default BannerUploadModal;
