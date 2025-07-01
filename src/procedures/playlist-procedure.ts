import { db } from "@/db";
import { playlists } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
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

  getMany: protectedProcedure.query(async ({ ctx: { id: userId } }) => {
    const userPlaylists = await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId));
    return {
      userPlaylists,
    };
  }),

  delete: protectedProcedure
    .input(z.object({ name: z.string().nonempty() }))
    .mutation(async ({ input: { name }, ctx: { id: userId } }) => {
      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(and(eq(playlists.name, name), eq(playlists.userId, userId)));

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const deletePlaylist = await db
        .delete(playlists)
        .where(and(eq(playlists.name, name), eq(playlists.userId, userId)))
        .returning();
      return {
        deletePlaylist,
      };
    }),
});
