import { EllipsisVertical } from "lucide-react";
import { Button } from "./ui/button";
import { mergeClasses } from "@/lib/utils";

export const DropDownTrigger = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <Button
      className={mergeClasses(
        className,
        " bg-background hover:bg-accent h-7 w-7"
      )}
      {...props}
    >
      <EllipsisVertical className="text-black" />
    </Button>
  );
};
export const DropDownItem = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <Button
      className={mergeClasses(
        className,
        " bg-background hover:bg-accent h-10 w-full border-b-2 rounded-none"
      )}
      {...props}
    />
  );
};
