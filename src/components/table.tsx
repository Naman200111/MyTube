import { mergeClasses } from "@/lib/utils";
import React from "react";

export const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<"thead">) => {
  return <thead className={className} {...props} />;
};

export const TableRow = ({
  className,
  ...props
}: React.ComponentProps<"tr">) => {
  return (
    <tr
      className={mergeClasses(className, "border-t-[1px] border-b-[1px]")}
      {...props}
    />
  );
};

export const TableDescription = ({
  className,
  ...props
}: React.ComponentProps<"td">) => {
  return <td className={className} {...props} />;
};

export const TableHead = ({
  className,
  ...props
}: React.ComponentProps<"th">) => {
  return (
    <th
      className={mergeClasses(className, "py-4 px-2  text-start")}
      {...props}
    />
  );
};

export const TableBody = ({
  className,
  ...props
}: React.ComponentProps<"tbody">) => {
  return <tbody className={className} {...props} />;
};

export const TableBreak = ({
  className,
  ...props
}: React.ComponentProps<"hr">) => {
  return <hr className={className} {...props} />;
};

export const Table = ({
  className,
  ...props
}: React.ComponentProps<"table">) => {
  return <table className={className} {...props} />;
};
