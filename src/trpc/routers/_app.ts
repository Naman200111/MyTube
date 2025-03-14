import { StudioProcedure } from "@/procedures/studio-procedure";
import { createTRPCRouter } from "../init";
import { categoryProcedure } from "@/procedures/category-procedure";
import { VideosProcedure } from "@/procedures/videos-procedure";

export const appRouter = createTRPCRouter({
  categories: categoryProcedure,
  studio: StudioProcedure,
  videos: VideosProcedure,
});

export type AppRouter = typeof appRouter;
