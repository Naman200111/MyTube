"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { APP_URL } from "@/lib/constants";
import AuthButton from "@/modules/auth/ui/components/AuthButton";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HomeNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const url = new URL("/search", APP_URL);
    if (searchQuery) {
      url.searchParams.set("query", encodeURIComponent(searchQuery.trim()));
    } else {
      url.searchParams.delete("query");
    }
    router.push(url.toString());
  };

  return (
    <div className="px-2.5 py-4 flex justify-between items-center">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="h-[30px] w-[30px] relative">
            <Image src="/logo.svg" alt="Logo" fill />
          </div>
          <p className="hidden text-xl font-semibold md:block">
            <Link href="/">MyTube</Link>
          </p>
        </div>
      </div>
      <div className="flex items-center w-full max-w-[500px]">
        <input
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="ml-2 px-2 py-1 rounded-l-full border 
        border-gray-300 max-w-[500px] w-full"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="mr-2 px-2 py-1 border border-gray-300 rounded-r-full border-l-0 bg-accent">
          <SearchIcon
            className="mx-1 text-muted-foreground ml-2 cursor-pointer"
            onClick={handleSearch}
          />
        </button>
      </div>
      <div className="flex gap-2">
        <AuthButton />
      </div>
    </div>
  );
};

export default HomeNavbar;
