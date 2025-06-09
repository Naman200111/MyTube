import { StudioProcedure } from "@/procedures/studio-procedure";
import { createTRPCRouter } from "../init";
import { categoryProcedure } from "@/procedures/category-procedure";
import { VideosProcedure } from "@/procedures/videos-procedure";
import { VideoViewsProcedure } from "@/procedures/video-views-procedure";
import { VideoReactionProcedure } from "@/procedures/video-reactions-procedure";

export const appRouter = createTRPCRouter({
  categories: categoryProcedure,
  studio: StudioProcedure,
  videos: VideosProcedure,
  videoViews: VideoViewsProcedure,
  videoReactions: VideoReactionProcedure,
});

export type AppRouter = typeof appRouter;
