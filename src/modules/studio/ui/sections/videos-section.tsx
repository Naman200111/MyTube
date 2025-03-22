"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "../../../../components/infinite-scroll";
import Table from "@/components/table";
import { Separator } from "@radix-ui/react-separator";
import { getFormattedDate } from "@/utils/utils";

interface rowData {
  id: string;
  title: string;
  userId: string;
  categoryId: string | null;
  description: string | null;
  updatedAt: Date;
  createdAt: Date;
  // when these will add up, ts errors will fix (TODOS)
  // video: string;
  // likes: string;
  // comments: string;
  // views: string;
  // [key: string]: any;
}

export const VideosSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Failed Fetching Studio Videos...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const videoHeaders = [
  {
    prettyName: "Video",
    key: "video",
    className: "w-[10%]",
    src: "/placeholder.svg",
    alt: "Thumbnail",
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

const VideosSectionSuspense = () => {
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: 5 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const pages = data.pages;
  const rows = pages.map((page) => {
    const { data: pageData = [] } = page;
    const ans = pageData.map((rowData: rowData) => {
      const row = videoHeaders.map((header) => {
        return {
          prettyName: header.prettyName,
          key: header.key,
          src: header.src || "",
          alt: header.alt || "",
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

  return (
    <div>
      <div className="text-3xl p-6">Channel Content</div>
      <div className="h-[1px] w-full bg-slate-200"></div>
      <Table className="w-full" headers={videoHeaders} rows={rows.flat()} />
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
