import Image from "next/image";
import React from "react";

interface header {
  prettyName?: string;
  key: string;
  type: string;
  className?: string;
  child?: header;
}

interface row {
  prettyName: string;
  key: string;
  value?: string;
  childValue?: string;
  hasChild?: boolean;
  src: string;
  alt: string;
}

interface tableProps {
  headers: header[];
  rows: row[][];
  className?: string;
}

const Table = ({ headers, rows, className }: tableProps) => {
  return (
    <table className={className}>
      <thead className="text-gray-600 text-sm w-full">
        <tr>
          {headers.map((header, index) => {
            return (
              <th
                className={`py-4 px-6 text-start ${header.className}`}
                key={index}
              >
                {header.prettyName}
              </th>
            );
          })}
        </tr>
        <tr>
          <td colSpan={headers.length}>
            <hr className="border-t border-slate-200" />
          </td>
        </tr>
      </thead>
      <tbody className="text-base">
        {rows.map((column, index) => {
          return (
            <React.Fragment key={index}>
              <tr key={`tr-${index}`}>
                {column.map((col, colIdx) => {
                  return (
                    <td className="px-4 py-4" key={colIdx}>
                      <div className="flex flex-col">
                        {col.src ? (
                          <Image
                            src={col.src}
                            alt={col.alt}
                            width={160}
                            height={160}
                            className="rounded-md"
                          />
                        ) : (
                          <div>{col.value || col.key}</div>
                        )}
                        {col.hasChild ? (
                          <div className="text-slate-600 line-clamp-2">
                            {col.childValue}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr key={`sep-${index}`}>
                <td colSpan={headers.length}>
                  <hr className="border-t border-slate-200" />
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
