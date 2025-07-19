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
import {
  getCountShortForm,
  getFormattedDate,
  getVideoTimeFromDuration,
} from "@/lib/utils";
import { Globe2, Loader2Icon, Lock } from "lucide-react";
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
  const videos = pages.flatMap((page) => page.data) || [];

  return (
    <div className="overflow-auto">
      <Table className="w-full">
        <TableHeader className="text-gray-600 text-sm h-10">
          <TableRow>
            <TableHead>Video</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Comments</TableHead>
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
                className="hover:bg-primary-foreground cursor-pointer max-h-[100px]"
              >
                <TableDescription className="p-2 min-w-[200px]">
                  <div className="flex flex-col relative h-28">
                    <div className="absolute rounded-lg px-1 bottom-2 right-2 bg-foreground text-background z-[1]">
                      {getVideoTimeFromDuration(video.duration)}
                    </div>
                    <div className="h-full">
                      <Image
                        src={video.thumbnailURL || "/placeholder.svg"}
                        alt="Thumbnail"
                        fill
                        className="rounded-lg w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </TableDescription>
                <TableDescription className="px-4 py-4 min-w-[400px]">
                  <div className="line-clamp-1 mb-2 text-lg">{video.title}</div>
                  <div className="line-clamp-2 text-sm text-gray-800">
                    {video.description}
                  </div>
                </TableDescription>
                <TableDescription className="px-4 py-4 w-[10%]">
                  <div className="flex items-center gap-1">
                    {video.visibility === "Private" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Globe2 className="h-4 w-4" />
                    )}
                    <div>{video.visibility}</div>
                  </div>
                </TableDescription>
                <TableDescription className="px-4 py-4 min-w-[200px]">
                  <div className="line-clamp-1">
                    {getFormattedDate(new Date(video.createdAt))}
                  </div>
                </TableDescription>
                <TableDescription className="px-3 py-4 min-w-[100px]">
                  <div>{getCountShortForm(video.likeCount)}</div>
                </TableDescription>
                <TableDescription className="px-3 py-4 min-w-[100px]">
                  <div>{getCountShortForm(video.viewCount)}</div>
                </TableDescription>
                <TableDescription className="px-3 py-4 min-w-[100px]">
                  <div>{getCountShortForm(video.commentCount)}</div>
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
