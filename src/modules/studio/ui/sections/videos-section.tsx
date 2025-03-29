"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InfiniteScroll from "../../../../components/infinite-scroll";
import {
  Table,
  TableBody,
  TableDescription,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { getFormattedDate } from "@/lib/utils";
import { Loader2Icon, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  const videos = pages?.[0]?.data || [];
  console.log(pages, "pages");

  return (
    <div>
      <Table>
        <TableHeader className="text-gray-600 text-sm w-full h-10">
          <TableRow>
            <TableHead className="w-[10%]">Video</TableHead>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[10%]">Visibility</TableHead>
            <TableHead className="w-[15%]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <Link
              href={`/studio/videos/${video.id}`}
              key={video.id}
              legacyBehavior
            >
              <TableRow
                key={video.id}
                className="hover:bg-primary-foreground cursor-pointer"
              >
                <TableDescription>
                  <div className="flex flex-col">
                    <Image
                      src={video.thumbnailURL || "/placeholder.svg"}
                      alt="Fallback image"
                      width={160}
                      height={160}
                      className="rounded-md"
                    />
                  </div>
                </TableDescription>
                <TableDescription>
                  <div>{video.title}</div>
                  <div>{video.description}</div>
                </TableDescription>
                <TableDescription className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <div>{video.visibility}</div>
                  </div>
                </TableDescription>
                <TableDescription>
                  <div>{getFormattedDate(new Date(video.createdAt))}</div>
                </TableDescription>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
