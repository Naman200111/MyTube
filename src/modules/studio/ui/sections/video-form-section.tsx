"use client";

import { trpc } from "@/trpc/client";

interface VideoFormSectionProps {
  videoId: string;
}

const VideoFormSection = ({ videoId }: VideoFormSectionProps) => {
  const [data] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  return <div>Video Form: {JSON.stringify(data)}</div>;
};

export default VideoFormSection;
