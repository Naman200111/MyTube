import { useEffect, useRef } from "react";
import { mergeClasses } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  onSubmit?: (values: Record<string, FormDataEntryValue>) => void;
  children: React.ReactNode;
  showClose?: boolean;
}

export const Modal = ({
  className,
  children,
  onClose,
  open,
  onSubmit,
  showClose = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!modalRef || !modalRef.current) return;
    const dialogInstance = modalRef.current;

    if (open) {
      dialogInstance.showModal();
    } else {
      dialogInstance.close();
    }
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      className={mergeClasses(
        className,
        "bg-white rounded-lg backdrop:backdrop-contrast-50 select-none overflow-hidden"
      )}
      onClose={onClose}
      onClick={(e) => {
        const target = e.target as HTMLDialogElement;
        if (target.nodeName === "DIALOG") {
          modalRef.current?.close();
        }
      }}
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const values = Object.fromEntries(formData.entries());
          if (onSubmit) {
            onSubmit(values);
          }
        }}
      >
        <div className="absolute right-2 top-2 cursor-pointer h-full">
          {showClose && (
            <X
              onClick={() => modalRef.current?.close()}
              size={22}
              className="z-1 rounded-full border bg-muted p-1"
            />
          )}
        </div>
        {children}
      </form>
    </dialog>
  );
};
