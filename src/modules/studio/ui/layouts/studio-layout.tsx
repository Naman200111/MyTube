import { SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "../components/studio-navbar";
import StudioSidebar from "../components/studio-sidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex">
          <StudioSidebar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
