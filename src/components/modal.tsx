import { useState } from "react";
import Input from "./input";
import { Button } from "./ui/button";

interface ModalProps {
  title: string;
  id?: string;
  description?: string;
  saveText: string;
  onSave: () => void;
}

export const Modal = ({
  title,
  description,
  saveText,
  onSave,
  id,
}: ModalProps) => {
  const [form, setForm] = useState({});

  const handleNameChange = (fieldName: string, e) => {
    setForm({
      ...form,
      [fieldName]: e.target.value,
    });
  };

  return (
    <div className="rounded-full h-[200px] w-[500px]" id={id} popover="auto">
      <div className="text-bold text-xl flex flex-col gap-6 w-full">
        <div>{title}</div>
        {description && <div>{description}</div>}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="text-lg font-semibold">Name</div>
        <Input
          className="p-2 w-full m-2"
          placeholder="Enter name of the playlist"
          onChange={(e) => handleNameChange("name", e)}
        />
        <div className="self-end">
          <Button size="sm" onClick={() => setForm({})}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSave}>
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
};
