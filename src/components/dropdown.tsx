import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { mergeClasses } from "@/lib/utils";
import { ReactNode } from "react";

interface DropDownItemProps extends React.ComponentProps<"button"> {
  icon?: ReactNode;
}

export const DropDownTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={mergeClasses(className, "relative select-none cursor-pointer")}
      {...props}
    >
      <EllipsisVertical className=" text-black" size={15} />
      {children ? (
        <div className="flex flex-col absolute right-0 z-[1] top-[2.25em] items-start border rounded-md overflow-hidden">
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
