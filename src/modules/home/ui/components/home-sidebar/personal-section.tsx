"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { History, ThumbsUp, ListVideo } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  const { setOpenMobile } = useSidebar();
  const { isSignedIn } = useAuth();

  const pathname = usePathname();
  const clerk = useClerk();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => setOpenMobile(false)}
            >
              <SidebarMenuButton
                asChild
                isActive={pathname.endsWith(item.url)}
                tooltip={item.title}
                onClick={(e) => {
                  if (item.auth && !isSignedIn) {
                    e.preventDefault();
                    clerk.openSignIn();
                    return;
                  }
                }}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default PersonalSection;
