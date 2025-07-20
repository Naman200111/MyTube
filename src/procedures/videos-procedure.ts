import { db } from "@/db";
import {
  categories,
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
import { UTApi } from "uploadthing/server";
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

      const [videoData] = await db
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
          // Todo: make this boolean instead of count
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

      if (!videoData) {
        throw new TRPCError({ message: "Video not found", code: "NOT_FOUND" });
      }

      return videoData;
    }),

  getManyFromQuery: baseProcedure
    .input(
      z.object({
        query: z.string().nullish(),
        userId: z.string().uuid().nullish(),
        category: z.string().default(""),
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { query, limit, cursor, category, userId } }) => {
      const [categoryData] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, category));

      const videosList = await db
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .where(
          and(
            and(
              query ? ilike(videos.title, `%${query}%`) : undefined,
              categoryData ? eq(videos.categoryId, categoryData.id) : undefined,
              eq(videos.visibility, "Public"),
              userId ? eq(videos.userId, userId) : undefined
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

  getManyTrending: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            viewCount: z.number(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { limit, cursor } }) => {
      const viewCount = db.$count(
        videoViews,
        eq(videos.id, videoViews.videoId)
      );

      const videosList = await db
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: viewCount,
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .where(
          and(
            eq(videos.visibility, "Public"),
            cursor
              ? or(
                  lt(viewCount, cursor.viewCount),
                  and(
                    eq(viewCount, cursor.viewCount),
                    lt(videos.updatedAt, cursor.updatedAt)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(viewCount), desc(videos.updatedAt))
        .limit(limit + 1);

      const hasMore = videosList.length > limit;
      const items = hasMore ? videosList.slice(0, -1) : videosList;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            viewCount: items[items.length - 1]?.viewCount,
            updatedAt: items[items.length - 1]?.updatedAt,
          }
        : null;

      return {
        items,
        cursor: nextCursor,
      };
    }),

  getManyLiked: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { limit, cursor }, ctx: { id: userId } }) => {
      const video_reactions_temp = await db.$with("video_reactions_temp").as(
        db
          .select()
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like")
            )
          )
      );

      const videosList = await db
        .with(video_reactions_temp)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
          videoReactionUpdatedAt: video_reactions_temp.updatedAt,
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(
          video_reactions_temp,
          eq(video_reactions_temp.videoId, videos.id)
        )
        .where(
          and(
            eq(videos.visibility, "Public"),
            cursor
              ? lt(video_reactions_temp.updatedAt, cursor.updatedAt)
              : undefined
          )
        )
        .orderBy(desc(video_reactions_temp.updatedAt), desc(videos.updatedAt))
        .limit(limit + 1);

      const hasMore = videosList.length > limit;
      const items = hasMore ? videosList.slice(0, -1) : videosList;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            updatedAt: items[items.length - 1]?.videoReactionUpdatedAt,
          }
        : null;

      return {
        items,
        cursor: nextCursor,
      };
    }),

  getManySubscribed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { limit, cursor }, ctx: { id: userId } }) => {
      const video_subscription_temp = await db
        .$with("video_subscription_temp")
        .as(
          db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.viewerId, userId))
        );

      const videosList = await db
        .with(video_subscription_temp)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
          videoReactionUpdatedAt: video_subscription_temp.updatedAt,
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(
          video_subscription_temp,
          eq(video_subscription_temp.creatorId, videos.userId)
        )
        .where(
          and(
            eq(videos.visibility, "Public"),
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

  getManyHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ input: { limit, cursor }, ctx: { id: userId } }) => {
      const video_views_temp = await db
        .$with("video_views_temp")
        .as(db.select().from(videoViews).where(eq(videoViews.userId, userId)));

      const videosList = await db
        .with(video_views_temp)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
          viewUpdatedAt: video_views_temp.updatedAt,
        })
        .from(videos)
        .innerJoin(users, eq(users.id, videos.userId))
        .innerJoin(video_views_temp, eq(video_views_temp.videoId, videos.id))
        .where(
          and(
            eq(videos.visibility, "Public"),
            cursor
              ? lt(video_views_temp.updatedAt, cursor.updatedAt)
              : undefined
          )
        )
        .orderBy(desc(video_views_temp.updatedAt), desc(videos.updatedAt))
        .limit(limit + 1);

      const hasMore = videosList.length > limit;
      const items = hasMore ? videosList.slice(0, -1) : videosList;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            updatedAt: items[items.length - 1]?.viewUpdatedAt,
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

  restore: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async ({ input: { videoId }, ctx }) => {
      const { id } = ctx;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId, id), eq(videos.id, videoId)));
      if (!existingVideo) {
        return new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingVideo.thumbnailKey) {
        const utApi = new UTApi();
        await utApi.deleteFiles(existingVideo.thumbnailKey);
      }

      const [video] = await db
        .update(videos)
        .set({
          thumbnailKey: null,
          thumbnailURL: existingVideo.playbackId
            ? `https://image.mux.com/${existingVideo.playbackId}/thumbnail.jpg`
            : null,
        })
        .where(and(eq(videos.userId, id), eq(videos.id, videoId)))
        .returning();

      return {
        video,
      };
    }),
});
