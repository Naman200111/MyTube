import { StudioProcedure } from "@/procedures/studio-procedure";
import { createTRPCRouter } from "../init";
import { categoryProcedure } from "@/procedures/category-procedure";
import { VideosProcedure } from "@/procedures/videos-procedure";
import { VideoViewsProcedure } from "@/procedures/video-views-procedure";

export const appRouter = createTRPCRouter({
  categories: categoryProcedure,
  studio: StudioProcedure,
  videos: VideosProcedure,
  videoViews: VideoViewsProcedure,
});

export type AppRouter = typeof appRouter;
