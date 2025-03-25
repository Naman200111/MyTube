import { db } from "@/db";
import { mux } from "../../../../mux/mux";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetDeletedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent;

export const POST = async (request: Request) => {
  const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;
  if (!MUX_WEBHOOK_SECRET) {
    throw new Error("Mux Video Upload Webhook Secret Not Found");
  }

  const { headers } = request;
  const muxSignature = headers.get("mux-signature");
  if (!muxSignature) {
    throw new Error("Mux signature not found in request headers");
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);
  mux.webhooks.verifySignature(
    body,
    { "mux-signature": muxSignature },
    MUX_WEBHOOK_SECRET
  );

  const webhookEventType: WebhookEvent["type"] = payload.type;
  if (webhookEventType === "video.asset.created") {
    const assetData = payload.data as VideoAssetCreatedWebhookEvent["data"];

    if (!assetData.upload_id) {
      return new Response("No upload id for asset found", { status: 400 });
    }

    await db
      .update(videos)
      .set({ muxAssetId: assetData.id, muxStatus: assetData.status })
      .where(eq(videos.muxUploadId, assetData.upload_id));
  } else if (webhookEventType === "video.asset.ready") {
    const assetData = payload.data as VideoAssetReadyWebhookEvent["data"];

    if (!assetData.upload_id) {
      return new Response("No upload id for asset found", { status: 400 });
    }

    console.log(assetData, "assetData");
    const { playback_ids, duration = 0 } = assetData;
    const PLAYBACK_ID = playback_ids?.[0]?.id;

    const thumbnailURL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg`;

    await db
      .update(videos)
      .set({
        muxStatus: assetData.status,
        thumbnailURL: thumbnailURL,
        playbackId: PLAYBACK_ID,
        duration: Math.floor(duration),
      })
      .where(eq(videos.muxUploadId, assetData.upload_id));
  } else if (webhookEventType === "video.asset.errored") {
    const assetData = payload.data as VideoAssetErroredWebhookEvent["data"];

    if (!assetData.upload_id) {
      return new Response("No upload id for asset found", { status: 400 });
    }

    await db
      .update(videos)
      .set({ muxStatus: assetData.status })
      .where(eq(videos.muxUploadId, assetData.upload_id));
  } else if (webhookEventType === "video.asset.deleted") {
    const assetData = payload.data as VideoAssetDeletedWebhookEvent["data"];

    if (!assetData.upload_id) {
      return new Response("No upload id for asset found", { status: 400 });
    }

    await db.delete(videos).where(eq(videos.muxUploadId, assetData.upload_id));
  }

  return new Response("Video Webhook Recived", { status: 200 });
};
