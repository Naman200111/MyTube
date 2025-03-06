// import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/components/AuthButton";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StudioNavbar = () => {
  return (
    <div className="px-2.5 py-4 flex justify-between items-center shadow-md border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <p className="text-xl font-semibold">
              <Link href="/">Studio</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">
          <Plus />
          Create
        </Button>
        <AuthButton />
      </div>
    </div>
  );
};

export default StudioNavbar;
