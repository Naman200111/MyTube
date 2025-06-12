import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { mergeClasses } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface DropDownItemProps extends React.ComponentProps<"button"> {
  icon?: ReactNode;
}

export const DropDownTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const [showDropDownOptions, setShowDropDownOptions] = useState(false);

  return (
    <div
      className={mergeClasses(className, "relative p-2 rounded-md select-none")}
      onClick={(e) => {
        // Todos: open only one dropdown when clicked in case of comments (not one for each)
        e.stopPropagation();
        setShowDropDownOptions((prev) => !prev);
      }}
      {...props}
    >
      <EllipsisVertical className=" text-black h-4 w-4" />
      {showDropDownOptions ? (
        <div className="flex flex-col absolute right-0 z-[1] top-[40px] items-start">
          {children}
        </div>
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
