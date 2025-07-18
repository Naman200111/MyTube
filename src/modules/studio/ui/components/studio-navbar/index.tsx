"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/components/AuthButton";
import Image from "next/image";
import Link from "next/link";
import VideoUploadModal from "../video-upload-btn";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon, Plus } from "lucide-react";

const StudioNavbar = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const utils = trpc.useUtils();

  const [muxUploaderVisibility, setMuxUploaderVisibility] = useState(false);

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate();
      toast.success("Video created successfully");
      setMuxUploaderVisibility(true);
    },
    onError: () => {
      toast.error("Failed to create video");
    },
  });

  return (
    <div className="px-2.5 py-4 flex justify-between items-center shadow-md border-b w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            {!isMobile ? (
              <p className="text-xl font-semibold">
                <Link href="/studio">Studio</Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <VideoUploadModal
          open={muxUploaderVisibility}
          onClose={() => setMuxUploaderVisibility(false)}
          endpoint={create.data?.url}
          onSuccess={() => {
            router.push(`/studio/videos/${create.data?.video?.id}`);
            setMuxUploaderVisibility(false);
          }}
        />
        <Button
          variant="secondary"
          onClick={() => {
            create.mutate();
          }}
          disabled={create.isPending}
        >
          {create.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Plus />
          )}
          Create
        </Button>
        <AuthButton />
      </div>
    </div>
  );
};

export default StudioNavbar;
