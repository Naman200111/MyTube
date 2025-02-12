"use client";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Flame, SquarePlay } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: Flame,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: SquarePlay,
    auth: true,
  },
];

const MainSection = () => {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  return (
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
  );
};

export default MainSection;
