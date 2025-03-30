import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    clerkId: text("clerk_id").notNull(),
    imageUrl: text("image_url").notNull(),
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

export const createVideoInsertSchema = createInsertSchema(videos);
