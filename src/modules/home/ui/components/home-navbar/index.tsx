// import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/components/AuthButton";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomeNavbar = () => {
  return (
    <div className="px-2.5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <p className="text-xl font-semibold">
              <Link href="/">MyTube</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full max-w-[500px]">
        <input
          type="text"
          placeholder="Search"
          className="px-2 py-1 rounded-l-full border 
        border-gray-300 max-w-[500px] w-full"
        />
        <button className="px-2 py-1 border border-gray-300 rounded-r-full border-l-0 bg-gray-100">
          <SearchIcon className="mx-1 text-gray-500 ml-2  cursor-pointer" />
        </button>
      </div>
      <div>
        <AuthButton />
      </div>
    </div>
  );
};

export default HomeNavbar;
