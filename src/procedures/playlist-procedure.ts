import { db } from "@/db";
import {
  playlists,
  playlistVideos,
  users,
  videos,
  videoViews,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, count, eq, getTableColumns, gt, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export const PlaylistProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
      })
    )
    .mutation(async ({ input: { name }, ctx: { id: userId } }) => {
      console.log(name, "inputName");
      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.name, name), eq(playlists.userId, userId)));

      if (existingPlaylist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Playlist with same name exists",
        });
      }

      const createPlaylist = await db
        .insert(playlists)
        .values({
          name,
          userId,
        })
        .returning();
      return {
        createPlaylist,
      };
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().nonempty(),
      })
    )
    .query(async ({ input: { playlistId } }) => {
      const videosInPlaylist = await db
        .select({
          ...getTableColumns(videos),
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          user: {
            ...getTableColumns(users),
          },
        })
        .from(playlistVideos)
        .innerJoin(videos, eq(videos.id, playlistVideos.videoId))
        .innerJoin(users, eq(users.id, videos.userId))
        .where(eq(playlistVideos.playlistId, playlistId))
        .orderBy(asc(playlistVideos.createdAt));

      const [userPlaylist] = await db
        .select({
          playlistId: playlists.id,
          playlistName: playlists.name,
        })
        .from(playlists)
        .where(eq(playlists.id, playlistId));

      return {
        userPlaylist,
        videos: videosInPlaylist,
      };
    }),

  // Todo: complex logic todo: check again
  getMany: protectedProcedure.query(async ({ ctx: { id: userId } }) => {
    const playlistsWithVideoCount = await db
      .select({
        ...getTableColumns(playlists),
        videoCount: count(playlistVideos.videoId),
      })
      .from(playlists)
      .leftJoin(playlistVideos, eq(playlistVideos.playlistId, playlists.id))
      .where(eq(playlists.userId, userId))
      .groupBy(playlists.id);

    const pv = alias(playlistVideos, "pv");
    const playlistWithTopVideoDetails = await db
      .select({
        playlistId: playlistVideos.playlistId,
        topVideoId: playlistVideos.videoId,
        topVideoThumbnail: videos.thumbnailURL,
      })
      .from(playlists)
      .leftJoin(playlistVideos, eq(playlistVideos.playlistId, playlists.id))
      .leftJoin(
        pv,
        and(
          eq(playlistVideos.playlistId, pv.playlistId),
          gt(playlistVideos.createdAt, pv.createdAt)
        )
      )
      .leftJoin(videos, eq(videos.id, playlistVideos.videoId))
      .where(and(eq(playlists.userId, userId), isNull(pv.id)));

    const userPlaylists = playlistsWithVideoCount.map((playlist) => {
      const firstVideo = playlistWithTopVideoDetails.find(
        (v) => v.playlistId === playlist.id
      );

      return {
        ...playlist,
        topVideoId: firstVideo?.topVideoId ?? null,
        topVideoThumbnail: firstVideo?.topVideoThumbnail ?? null,
      };
    });

    return {
      userPlaylists,
    };
  }),

  getManyForVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .query(async ({ input: { videoId }, ctx: { id: userId } }) => {
      const userPlaylists = await db
        .select({
          ...getTableColumns(playlists),
          videoInPlaylist: playlistVideos.videoId,
        })
        .from(playlists)
        .leftJoin(
          playlistVideos,
          and(
            eq(playlistVideos.playlistId, playlists.id),
            eq(playlistVideos.videoId, videoId)
          )
        )
        .where(eq(playlists.userId, userId));

      return {
        userPlaylists,
      };
    }),

  mutateVideo: protectedProcedure
    .input(
      z.object({
        playlistId: z.string().nonempty(),
        videoId: z.string().nonempty(),
      })
    )
    .mutation(
      async ({ input: { playlistId, videoId }, ctx: { id: userId } }) => {
        const [existingPlaylist] = await db
          .select()
          .from(playlists)
          .where(eq(playlists.id, playlistId));
        if (!existingPlaylist) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (existingPlaylist.userId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const videosInPlaylist = await db
          .select()
          .from(playlistVideos)
          .where(eq(playlistVideos.playlistId, playlistId));

        const hasVideo = videosInPlaylist.some(
          (video) => video.videoId === videoId
        );

        if (!hasVideo) {
          const [addVideo] = await db
            .insert(playlistVideos)
            .values({ videoId, playlistId })
            .returning();

          return {
            videos: [...videosInPlaylist, addVideo],
            videoAdded: true,
            name: existingPlaylist.name,
            playlistId: existingPlaylist.id,
          };
        } else {
          await db
            .delete(playlistVideos)
            .where(
              and(
                eq(playlistVideos.videoId, videoId),
                eq(playlistVideos.playlistId, playlistId)
              )
            )
            .returning();

          const restVideos = videosInPlaylist.filter(
            (video) => video.id !== videoId
          );

          return {
            videoAdded: false,
            videos: restVideos,
            name: existingPlaylist.name,
            playlistId: existingPlaylist.id,
          };
        }
      }
    ),

  delete: protectedProcedure
    .input(z.object({ playlistId: z.string().uuid().nonempty() }))
    .mutation(async ({ input: { playlistId }, ctx: { id: userId } }) => {
      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const deletePlaylist = await db
        .delete(playlists)
        .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))
        .returning();
      return {
        deletePlaylist,
      };
    }),
});
