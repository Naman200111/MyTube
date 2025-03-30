import { mergeClasses } from "@/lib/utils";

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      {...props}
      className={mergeClasses(
        className,
        "p-1 mt-2 pl-2 border rounded-md border-muted-foreground min-h-[200px]"
      )}
    />
  );
};

export default Textarea;
