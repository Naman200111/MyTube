"use client";

import { DropDownItem, DropDownTrigger } from "@/components/dropdown";
import Input from "@/components/input";
import { Select, SelectItem } from "@/components/select";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Copy, ImagePlusIcon, RotateCcw, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MuxPlayer from "@mux/mux-player-react";
import { getSnakeCasing } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/use-click-outside";
import ImageUploadModal from "../components/image-upload-modal";

interface VideoFormSectionProps {
  videoId: string;
}

const VideoFormSection = ({ videoId }: VideoFormSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showMoreUploadOptions, setShowMoreUploadOptions] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  useClickOutside(() => {
    setShowMoreOptions(false);
    setShowMoreUploadOptions(false);
  });

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

  const videoLink = `http://localhost:3000/video/${video?.id}`;
  const [formData, setFormData] = useState({
    id: video?.id || "",
    title: video?.title || "",
    description: video?.description || "",
    categoryId: video?.categoryId || "",
    visibility: video?.visibility || "Private",
    playbackId: video?.playbackId || "",
    muxStatus: video?.muxStatus || "preparing",
  });

  useEffect(() => {
    if (video?.id) {
      setFormData((prev) => ({
        ...prev,
        playbackId: video?.playbackId || "",
        muxStatus: video?.muxStatus || "",
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
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div>
          <div className="text-2xl font-bold">Video Details</div>
          <div className="text-sm text-muted-foreground">
            Manage your videos here
          </div>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <Button
            onClick={() => update.mutate(formData)}
            disabled={update.isPending}
          >
            Save
          </Button>
          <DropDownTrigger
            className="bg-background hover:bg-accent p-2 rounded-full"
            onClick={() => setShowMoreOptions((prev) => !prev)}
          >
            {showMoreOptions ? (
              <DropDownItem
                icon={<Trash />}
                onClick={() => deleteVideo.mutate({ id: formData.id })}
              >
                Delete
              </DropDownItem>
            ) : null}
          </DropDownTrigger>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-14">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <div className="flex flex-col">
            <span className="font-medium">Title</span>
            <Input
              type="text"
              className="text-sm mt-2 pl-2"
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
            <div className="relative max-w-[160px] h-24">
              <Image
                src={video?.thumbnailURL || "/placeholder.svg"}
                fill
                alt="Thumbnail"
                className="overflow-hidden rounded-md object-cover"
              />
              <DropDownTrigger
                className="absolute rounded-full p-1 ml-auto bg-gray-100 w-[22.5px] m-1"
                onClick={() => setShowMoreUploadOptions((prev) => !prev)}
              >
                {showMoreUploadOptions ? (
                  <>
                    <DropDownItem onClick={() => setShowImageUploadModal(true)}>
                      <ImagePlusIcon /> Change
                    </DropDownItem>
                    <DropDownItem>
                      <RotateCcw /> Restore
                    </DropDownItem>
                  </>
                ) : null}
              </DropDownTrigger>
            </div>
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
        <div className="flex flex-col gap-10 lg:col-span-1">
          <div className="bg-accent flex flex-col gap-6 rounded-md pb-4 text-muted-foreground">
            <MuxPlayer
              className="w-full aspect-video overflow-hidden rounded-md rounded-b-none"
              playbackId={formData.playbackId}
              poster={video.thumbnailURL || "/placeholder.svg"}
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
                <div>
                  <Copy
                    onClick={handleCopyClick}
                    className="cursor-pointer text-slate-900 p-1"
                  />
                </div>
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
      <ImageUploadModal
        open={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        videoId={video.id}
      />
    </div>
  );
};

export default VideoFormSection;
