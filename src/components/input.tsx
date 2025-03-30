import { mergeClasses } from "@/lib/utils";

const Input = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <input
      {...props}
      className={mergeClasses(
        className,
        "p-1 mt-2 pl-2 border rounded-md border-muted-foreground"
      )}
    />
  );
};

export default Input;
