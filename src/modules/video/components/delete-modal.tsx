import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface DeleteModalProps {
  onClose: () => void;
  open: boolean;
  entity?: string;
  onOk: () => void;
  disabled?: boolean;
}

const DeleteModal = ({
  onClose,
  open,
  entity,
  onOk,
  disabled,
}: DeleteModalProps) => {
  return (
    <Modal onClose={onClose} open={open} showClose={false}>
      <div className="p-4 flex flex-col gap-4 max-h-[600px]">
        <div className="flex gap-2 items-center">
          <Trash2Icon color="red" size={16} />
          <p className="font-semibold text-md ">
            Are you sure you want to delete this {entity} ?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={onClose} disabled={disabled}>
            No, Keep it!
          </Button>
          <Button size="sm" onClick={onOk} disabled={disabled}>
            Yes, Do it!
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
