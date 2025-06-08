import { db } from "@/db";
import { users, videos, videoViews } from "@/db/schema";

import { mux } from "@/mux/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const VideosProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;
      const { videoId } = input;

      const videoData = await db
        .select({
          ...getTableColumns(users),
          ...getTableColumns(videos),
          // creates a subquery
          view_count: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        // .innerJoin(videoViews, eq(videos.id, videoViews.videoId))
        .where(eq(videos.id, videoId));

      if (!videoData) {
        throw new TRPCError({ message: "Video not found", code: "NOT_FOUND" });
      }
      return videoData;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        title: z.string(),
        description: z.string(),
        categoryId: z.string().nullish(),
        visibility: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { id } = ctx;

      const { id: videoId, title, description, visibility, categoryId } = input;
      const update = await db
        .update(videos)
        .set({
          title: title,
          description: description,
          categoryId: categoryId || null,
          visibility: visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.userId, id), eq(videos.id, videoId)))
        .returning();

      if (!update) {
        throw new TRPCError({ message: "Update Failed", code: "BAD_REQUEST" });
      }

      return {
        update,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().nonempty() }))
    .mutation(async (opts) => {
      const { id } = opts.ctx;
      const { input } = opts;
      const { id: videoId } = input;

      if (!videoId) {
        throw new TRPCError({
          message: "Video Id should be present",
          code: "NOT_FOUND",
        });
      }

      const deletedVideo = await db
        .delete(videos)
        .where(and(eq(videos.id, videoId), eq(videos.userId, id)))
        .returning();

      if (!deletedVideo) {
        throw new TRPCError({
          message: "Deletion Failed",
          code: "BAD_REQUEST",
        });
      }

      return {
        delete: deletedVideo,
      };
    }),

  create: protectedProcedure.mutation(async (opts) => {
    const { id } = opts.ctx;

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId: id,
        title: "Untitled",
        description: "This is a test upload video",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video,
      url: upload.url,
    };
  }),
});
