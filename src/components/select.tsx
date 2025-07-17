import { mergeClasses } from "@/lib/utils";

export const Select = ({
  className,
  ...props
}: React.ComponentProps<"select">) => {
  return (
    <select
      className={mergeClasses(
        className,
        "p-1 mt-2 pl-2 border rounded-md border-muted-foreground focus:border-muted-foreground"
      )}
      {...props}
    />
  );
};

export const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<"option">) => {
  return (
    <option
      className={mergeClasses(
        className,
        "p-1 mt-2 pl-2 border rounded-md border-muted-foreground focus:border-muted-foreground"
      )}
      {...props}
    >
      {children}
    </option>
  );
};
