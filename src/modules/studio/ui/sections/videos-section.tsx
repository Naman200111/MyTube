"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "../../../../components/infinite-scroll";
import Table from "@/components/table";
import { Separator } from "@radix-ui/react-separator";
import { getFormattedDate } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface rowData {
  id: string;
  title: string;
  userId: string;
  categoryId: string | null;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
  // when these will add up, ts errors will fix (TODOS)
  thumbnailURL: string;
  // likes: string;
  // comments: string;
  // views: string;
  // [key: string]: any;
}

const videoHeaders = [
  {
    prettyName: "Video",
    key: "thumbnailURL",
    className: "w-[10%]",
    placeholderThumbnail: "/placeholder.svg",
    type: "image",
  },
  {
    prettyName: "Title",
    key: "title",
    className: "w-[40%]",
    type: "string",
    child: {
      key: "description",
      type: "string",
      className: "text-slate-50",
    },
  },
  {
    prettyName: "Date",
    key: "createdAt",
    className: "w-[15%]",
    type: "date",
  },
  {
    prettyName: "Likes",
    key: "likes",
    className: "w-[10%]",
    type: "string",
  },
  {
    prettyName: "Views",
    key: "views",
    className: "w-[10%]",
    type: "string",
  },
  {
    prettyName: "Comments",
    key: "comments",
    className: "w-[10%]",
    type: "string",
  },
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

  console.log(data, "data");
  const pages = data.pages;
  const rows = pages.map((page) => {
    const { data: pageData = [] } = page;
    const ans = pageData.map((rowData: rowData) => {
      const row = videoHeaders.map((header) => {
        return {
          prettyName: header.prettyName,
          key: header.key,
          placeholderThumbnail: header.placeholderThumbnail || "",
          value:
            header.type === "date"
              ? getFormattedDate(new Date(rowData[header.key]))
              : rowData[header.key],
          childValue: rowData[header?.child?.key] || "No Description",
          hasChild: header.child ? true : false,
        };
      });
      return row;
    });
    return ans;
  });

  console.log(rows, "rows");
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
