"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogOut, VideoIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const StudioSidebar = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
  }

  return (
    <Sidebar className="top-[84px] absolute border-none" collapsible="icon">
      <SidebarContent className="bg-white gap-1">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {user ? (
                <SidebarMenuItem
                  className={`w-full flex justify-center items-center flex-col my-${
                    state === "collapsed" ? 0 : 4
                  }`}
                >
                  {state !== "collapsed" ? (
                    <>
                      <Avatar className="h-[120px] w-auto flex flex-col">
                        <AvatarImage src={user?.imageUrl} />
                      </Avatar>
                      <strong className="mt-[1em]">Your Profile</strong>
                      <span>{user?.firstName}</span>
                    </>
                  ) : (
                    <SidebarMenuButton
                      tooltip={user?.firstName || "Your Profile"}
                    >
                      <Avatar className="w-auto h-[20px]">
                        <AvatarImage src={user?.imageUrl} />
                      </Avatar>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem
                  className={`w-full flex justify-center items-center flex-col my-${
                    state === "collapsed" ? 0 : 4
                  }`}
                >
                  <Skeleton className="h-[120px] w-[120px] rounded-full"></Skeleton>
                  <Skeleton className="w-[100px] h-[20px] mt-[1em]"></Skeleton>
                  <Skeleton className="w-[80px] h-[20px] mt-[0.5em]"></Skeleton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem
                className={`${state === "collapsed" ? "mt-2" : "mt-4"}`}
              >
                <SidebarMenuButton asChild tooltip="Content">
                  <a href={"/content"}>
                    <VideoIcon />
                    <span>Content</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Exit Studio">
                  <a href={"/"}>
                    <LogOut />
                    <span>Exit Studio</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudioSidebar;
