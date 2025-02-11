import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { History, ThumbsUp, ListVideo } from "lucide-react";

const items = [
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Liked Videos",
    url: "/liked",
    icon: ThumbsUp,
  },
  {
    title: "All playlists",
    url: "/playlists",
    icon: ListVideo,
  },
];

const PersonalSection = () => {
  return (
    <>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
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
