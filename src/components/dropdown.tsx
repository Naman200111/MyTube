import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { mergeClasses } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface DropDownItemProps extends React.ComponentProps<"button"> {
  icon: ReactNode;
}

export const DropDownTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const [showDropDownOptions, setShowDropDownOptions] = useState(false);
  return (
    <div
      className={mergeClasses(
        className,
        " bg-background hover:bg-accent p-2 rounded-md select-none"
      )}
      onClick={() => setShowDropDownOptions((prev) => !prev)}
      {...props}
    >
      <EllipsisVertical className="text-black h-4 w-4" />
      {showDropDownOptions ? (
        <div className="absolute right-5 flex flex-col mt-4">{children}</div>
      ) : null}
    </div>
  );
};

export const DropDownItem = ({
  className,
  children,
  icon,
  ...props
}: DropDownItemProps) => {
  return (
    <Button
      className={mergeClasses(
        className,
        "rounded-none bg-background text-foreground hover:bg-accent px-6 select-none"
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
};
