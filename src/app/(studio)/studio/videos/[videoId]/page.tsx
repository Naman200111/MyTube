import VideoView from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

const VideoPage = async ({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) => {
  const { videoId } = await params;
  void trpc.studio.getOne.prefetch({ videoId });
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
