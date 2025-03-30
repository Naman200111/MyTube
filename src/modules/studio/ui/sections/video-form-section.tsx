"use client";

import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import Input from "@/components/input";
import { Select, SelectItem } from "@/components/select";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface VideoFormSectionProps {
  videoId: string;
}

const VideoFormSection = ({ videoId }: VideoFormSectionProps) => {
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Changes Saved");
    },
    onError: () => {
      toast.error("Error while applying changes!");
    },
  });

  const deleteVideo = trpc.videos.delete.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Deleted");
    },
    onError: () => {
      toast.error("Video Deletion failed");
    },
  });

  const [formData, setFormData] = useState({
    id: video?.[0]?.id || "",
    title: video?.[0]?.title || "",
    description: video?.[0]?.description || "",
    categoryId: video?.[0]?.categoryId || "",
    visibility: video?.[0]?.visibility || "Private",
  });

  const handleFormChange = (formField: string, value: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        [formField]: value,
      };
    });
  };

  return (
    <div className="w-full px-6 pt-6 pb-4 flex flex-col gap-6 max-w-[1440px]">
      <div className="w-full flex justify-between">
        <div>
          <div className="text-2xl font-bold">Video Details</div>
          <div className="text-sm text-muted-foreground">
            Manage your videos here
          </div>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <Link href="/studio">
            <Button
              onClick={() => update.mutate(formData)}
              disabled={update.isPending}
            >
              Save
            </Button>
          </Link>
          <DropDownTrigger>
            <Link href="/studio">
              <DropDownItem
                icon={<Trash />}
                onClick={() => deleteVideo.mutate({ id: formData.id })}
              >
                Delete
              </DropDownItem>
            </Link>
          </DropDownTrigger>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">
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
        <div>column2</div>
      </div>
    </div>
  );
};

export default VideoFormSection;
