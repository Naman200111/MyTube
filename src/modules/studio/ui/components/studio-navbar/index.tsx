"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/components/AuthButton";
import Image from "next/image";
import Link from "next/link";
import VideoUploadModal from "../video-upload-btn";
import { useIsMobile } from "@/hooks/use-mobile";

const StudioNavbar = () => {
  const isMobile = useIsMobile();
  return (
    <div className="px-2.5 py-4 flex justify-between items-center shadow-md border-b">
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
        <VideoUploadModal />
        <AuthButton />
      </div>
    </div>
  );
};

export default StudioNavbar;
