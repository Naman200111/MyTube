import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import MainSection from "./main-section";
import PersonalSection from "./personal-section";
import { Separator } from "@/components/ui/separator";

const HomeSidebar = () => {
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
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
