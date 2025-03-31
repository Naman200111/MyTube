import { mergeClasses } from "@/lib/utils";
// import { ReactNode } from "react";

// interface SelectItemProps extends React.ComponentProps<"div"> {
//   icon?: ReactNode;
// }

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
  // icon,
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
      {/* {icon} */}
      {children}
    </option>
  );
};
