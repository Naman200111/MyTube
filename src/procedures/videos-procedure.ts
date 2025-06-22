import { db } from "@/db";
import {
  subscriptions,
  users,
  videoReactions,
  videos,
  videoViews,
} from "@/db/schema";

import { mux } from "@/mux/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, ilike, lt, or } from "drizzle-orm";
import { z } from "zod";

export const VideosProcedure = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const { clerkUserId } = ctx;
      const { videoId } = input;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId || ""));

      const viewerReactionWithTable = db.$with("viewer_reaction").as(
        db
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(eq(videoReactions.userId, user?.id))
      );

      const videoData = await db
        .with(viewerReactionWithTable)
        .select({
          ...getTableColumns(users),
          ...getTableColumns(videos),
          // creates a subquery
          viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videos.id, videoReactions.videoId),
              eq(videoReactions.type, "like")
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videos.id, videoReactions.videoId),
              eq(videoReactions.type, "dislike")
            )
          ),
          viewerReaction: viewerReactionWithTable.type,
          subscribersCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, users.id)
          ),
          // Todos: make this boolean instead of count
          isViewerSubscribed: db.$count(
            subscriptions,
            and(
              eq(subscriptions.creatorId, users.id),
              eq(subscriptions.viewerId, user?.id)
            )
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .leftJoin(
          viewerReactionWithTable,
          eq(videos.id, viewerReactionWithTable.videoId)
        )
        .where(eq(videos.id, videoId));

      //Todo : remove console
      console.log(videoData, "videoData");
      if (!videoData) {
        throw new TRPCError({ message: "Video not found", code: "NOT_FOUND" });
      }

      return videoData;
    }),

  getManyFromQuery: baseProcedure
    .input(
      z.object({
        query: z.string().default(""),
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { query, limit, cursor } }) => {
      const videosList = await db
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .where(
          and(
            and(
              query ? ilike(videos.title, query) : undefined,
              eq(videos.visibility, "Public")
            ),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt))
        .limit(limit + 1);

      const hasMore = videosList.length > limit;
      const items = hasMore ? videosList.slice(0, -1) : videosList;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            updatedAt: items[items.length - 1]?.updatedAt,
          }
        : null;

      return {
        items,
        cursor: nextCursor,
      };
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
