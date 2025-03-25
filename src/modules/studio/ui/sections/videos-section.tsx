"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "../../../../components/infinite-scroll";
import Table from "@/components/table";
import { getFormattedDate } from "@/lib/utils";
import { Loader2Icon, Lock } from "lucide-react";

const videoHeaders = [
  {
    prettyName: "Video",
    key: "thumbnailURL",
    className: "w-[10%]",
    type: "image",
    icon: null,
    placeholder: "/placeholder.svg",
    childKey: "",
  },
  {
    prettyName: "Title",
    key: "title",
    className: "w-[40%]",
    type: "string",
    placeholder: "Video Title",
    icon: null,
    childKey: "description",
  },
  {
    prettyName: "Visibility",
    key: "visibility",
    className: "w-[10%]",
    type: "string",
    icon: <Lock className="h-4 w-4" />,
    placeholder: "Private / Public",
    childKey: "",
  },
  {
    prettyName: "Date",
    key: "createdAt",
    className: "w-[15%]",
    type: "date",
    icon: null,
    placeholder: new Date(),
    childKey: "",
  },
  // {
  //   prettyName: "Likes",
  //   key: "likes",
  //   className: "w-[10%]",
  //   type: "string",
  // },
  // {
  //   prettyName: "Views",
  //   key: "views",
  //   className: "w-[10%]",
  //   type: "string",
  // },
  // {
  //   prettyName: "Comments",
  //   key: "comments",
  //   className: "w-[10%]",
  //   type: "string",
  // },
];

export const VideosSection = () => {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex justify-center">
          <Loader2Icon className="animate-spin mt-10" />
        </div>
      }
    >
      <ErrorBoundary
        fallback={<p className="p-6">Failed Fetching Studio Videos...</p>}
      >
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSuspense = () => {
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const pages = data.pages;
  const rows = pages.map((page) => {
    const { data: pageData = [] } = page;
    const updatedRows = pageData.map((rowData) => {
      const row = videoHeaders.map((header) => {
        return {
          prettyName: header.prettyName,
          key: header.key,
          type: header.type,
          placeholder: header.placeholder || "placeholder",
          icon: header.icon,
          value:
            header.type === "date"
              ? getFormattedDate(
                  new Date(
                    rowData[header.key as keyof typeof rowData] ||
                      header.placeholder
                  )
                )
              : rowData[header.key as keyof typeof rowData] ||
                header.placeholder,
          // childValue: rowData[header.child.key] || header.child.placeholder || "No Child Content",
          childValue:
            rowData[header.childKey as keyof typeof rowData] ||
            "No Child Content",
          hasChild: header.childKey ? true : false,
        };
      });
      return row;
    });
    return updatedRows;
  });

  return (
    <div>
      <Table className="w-full" headers={videoHeaders} rows={rows.flat()} />
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
