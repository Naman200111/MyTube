import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  integer,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    clerkId: text("clerk_id").notNull(),
    imageUrl: text("image_url").notNull(),
    bannerKey: text("banner_key"),
    bannerUrl: text("banner_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    description: text("description"),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  viewerId: uuid("viewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videos = pgTable("videos", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: text("title").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  thumbnailURL: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),
  muxUploadId: text("mux_upload_id"),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id"),
  playbackId: text("playback_id"),
  duration: integer("duration").default(0).notNull(),
  visibility: text("visibility").default("Private").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videoViews = pgTable("video_views", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoReactions = pgTable("video_reactions", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: reactionType("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    value: text("value"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: "comment_parent_id_fkey",
      }).onDelete("cascade"),
    ];
  }
);

export const commentReactions = pgTable("comment_reactions", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => comments.id, {
      onDelete: "cascade",
    }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: reactionType("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlists = pgTable("playlists", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlistVideos = pgTable("playlist_videos", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  playlistId: uuid("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
