"use client";

import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { History, ThumbsUp, ListVideo } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

const items = [
  {
    title: "History",
    url: "/history",
    icon: History,
    auth: true,
  },
  {
    title: "Liked Videos",
    url: "/liked",
    icon: ThumbsUp,
    auth: true,
  },
  {
    title: "All playlists",
    url: "/playlists",
    icon: ListVideo,
    auth: true,
  },
];

const PersonalSection = () => {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  return (
    <>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                onClick={(e) => {
                  if (item.auth && !isSignedIn) {
                    e.preventDefault();
                    clerk.openSignIn();
                    return;
                  }
                }}
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
};

export default PersonalSection;
