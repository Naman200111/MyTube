"use client";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import MainSection from "./main-section";
import PersonalSection from "./personal-section";
import { Separator } from "@/components/ui/separator";
import UserSubscriptionSection from "./user-subscription";
import { SignedIn } from "@clerk/nextjs";

const HomeSidebar = () => {
  const { state } = useSidebar();
  return (
    <Sidebar className="top-[64px] absolute border-none" collapsible="icon">
      <SidebarContent className="bg-white">
        <MainSection />
        <Separator className="mt-2 mb-4" />
        <PersonalSection />
        <Separator className="mt-2 mb-2" />
        {state === "expanded" && (
          <SignedIn>
            <UserSubscriptionSection />
          </SignedIn>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
