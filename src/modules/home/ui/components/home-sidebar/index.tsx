"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import MainSection from "./main-section";
import PersonalSection from "./personal-section";
import { Separator } from "@/components/ui/separator";
import UserSubscriptionSection from "./user-subscription";

const HomeSidebar = () => {
  const { state } = useSidebar();
  return (
    <Sidebar className="top-[64px] absolute border-none" collapsible="icon">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <MainSection />
        </SidebarGroup>
        <Separator className="mt-2 mb-4" />
        <SidebarGroup>
          <PersonalSection />
        </SidebarGroup>
        <Separator className="mt-2 mb-2" />
        {state === "expanded" && (
          <SidebarGroup>
            <UserSubscriptionSection />
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
