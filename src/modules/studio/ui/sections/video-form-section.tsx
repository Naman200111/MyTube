"use client";

import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import Input from "@/components/input";
import { Select, SelectItem } from "@/components/select";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Copy, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MuxPlayer from "@mux/mux-player-react";
import { getSnakeCasing } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VideoFormSectionProps {
  videoId: string;
}

const VideoFormSection = ({ videoId }: VideoFormSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      // invalidate basically update a video values, so specifically updaing one video and keeping cache of others
      // utils.studio.getOne.invalidate();
      utils.studio.getOne.invalidate({ videoId });
      toast.success("Video Changes Saved");
      router.push("/studio");
    },
    onError: () => {
      toast.error("Error while applying changes!");
    },
  });

  const deleteVideo = trpc.videos.delete.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Deleted");
      router.push("/studio");
    },
    onError: () => {
      toast.error("Video Deletion failed");
    },
  });

  const videoLink = `http://localhost:3000/video/${video?.[0]?.id}`;
  const [formData, setFormData] = useState({
    id: video?.[0]?.id || "",
    title: video?.[0]?.title || "",
    description: video?.[0]?.description || "",
    categoryId: video?.[0]?.categoryId || "",
    visibility: video?.[0]?.visibility || "Private",
    playbackId: video?.[0]?.playbackId || "",
    muxStatus: video?.[0]?.muxStatus || "preparing",
  });

  useEffect(() => {
    if (video?.[0]?.id) {
      setFormData((prev) => ({
        ...prev,
        playbackId: video?.[0]?.playbackId || "",
        muxStatus: video?.[0]?.muxStatus || "",
      }));
    }
  }, [video]);

  const handleFormChange = (formField: string, value: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        [formField]: value,
      };
    });
  };

  const handleCopyClick = () => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(videoLink);
  };

  return (
    <div className="w-full px-6 pt-6 pb-4 flex flex-col gap-6 max-w-[1280px]">
      <div className="w-full flex justify-between">
        <div>
          <div className="text-2xl font-bold">Video Details</div>
          <div className="text-sm text-muted-foreground">
            Manage your videos here
          </div>
        </div>
        <div className="flex gap-2 items-center cursor-pointer lg:col-span-2">
          <Button
            onClick={() => update.mutate(formData)}
            disabled={update.isPending}
          >
            Save
          </Button>
          <DropDownTrigger className="bg-background hover:bg-accent">
            <DropDownItem
              icon={<Trash />}
              onClick={() => deleteVideo.mutate({ id: formData.id })}
            >
              Delete
            </DropDownItem>
          </DropDownTrigger>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-14">
        <div className="flex flex-col gap-8 col-span-2">
          <div className="flex flex-col">
            <span className="font-medium">Title</span>
            <Input
              type="text"
              className="text-sm"
              value={formData.title}
              placeholder="Video Title"
              onChange={(e) => handleFormChange("title", e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Description</span>
            <Textarea
              className="text-sm"
              value={formData.description}
              placeholder="Add a description to your video"
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Thumbnail</span>
            <Image
              src={video?.[0]?.thumbnailURL || "/placeholder.svg"}
              width={150}
              height={150}
              alt="Thumbnail"
            ></Image>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Category</span>
            <Select
              defaultValue={formData.categoryId}
              onChange={(e) => handleFormChange("categoryId", e.target.value)}
            >
              <SelectItem key="none" value="">
                None
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-10 col-span-1">
          <div className="bg-gray-100 flex flex-col gap-6 rounded-md pb-4 text-muted-foreground">
            <MuxPlayer
              className="w-full aspect-video"
              playbackId={formData.playbackId}
              placeholder="/placeholder.svg"
              playerInitTime={0}
            />
            <div className="flex flex-col gap-1 px-4">
              <div>Video Link</div>
              <div className="flex gap-2 items-center">
                <div
                  className="truncate text-blue-600 cursor-pointer"
                  onClick={() => router.push(videoLink)}
                >
                  {videoLink}
                </div>
                <Copy
                  onClick={handleCopyClick}
                  className="cursor-pointer text-slate-900"
                  size={30}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 px-4 pb-4 ">
              <span>Video Status</span>
              <span className="text-primary">
                {getSnakeCasing(formData.muxStatus)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-medium">Visibility</span>
            <Select
              defaultValue={formData.visibility}
              onChange={(e) => handleFormChange("visibility", e.target.value)}
            >
              <SelectItem key="private" value="Private">
                Private
              </SelectItem>
              <SelectItem key="public" value="Public">
                Public
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFormSection;
