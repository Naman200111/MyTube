import { StudioProcedure } from "@/procedures/studio-procedure";
import { createTRPCRouter } from "../init";
import { categoryProcedure } from "@/procedures/category-procedure";
import { VideosProcedure } from "@/procedures/videos-procedure";
import { VideoViewsProcedure } from "@/procedures/video-views-procedure";
import { VideoReactionProcedure } from "@/procedures/video-reactions-procedure";
import { subscriptionProcedure } from "@/procedures/subscription-procedure";
import { CommentsProcedure } from "@/procedures/comments-procedure";
import { CommentReactionProcedure } from "@/procedures/comments-reaction-procedure";

export const appRouter = createTRPCRouter({
  categories: categoryProcedure,
  studio: StudioProcedure,
  subscriptions: subscriptionProcedure,
  videos: VideosProcedure,
  videoViews: VideoViewsProcedure,
  videoReactions: VideoReactionProcedure,
  comments: CommentsProcedure,
  commentReactions: CommentReactionProcedure,
});

export type AppRouter = typeof appRouter;
