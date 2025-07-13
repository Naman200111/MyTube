"use client";

import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import UserAvatar from "@/components/user-avatar";
import { usePathname, useRouter } from "next/navigation";
import { List } from "lucide-react";

const UserSubscriptionSection = () => {
  const { isSignedIn } = useAuth();
  const { data: userSubscriptions } = trpc.subscriptions.getMany.useQuery(
    undefined,
    {
      enabled: isSignedIn,
    }
  );
  const router = useRouter();
  const pathname = usePathname();

  if (!isSignedIn || !userSubscriptions || userSubscriptions.length == 0) {
    return <></>;
  }

  return (
    <SidebarGroupContent>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarMenu>
        {userSubscriptions.slice(0, 5).map(({ creator }) => (
          <SidebarMenuItem key={creator.id}>
            <SidebarMenuButton
              asChild
              size="sm"
              className="cursor-pointer"
              isActive={pathname.includes(creator.id)}
              tooltip={creator.name}
              onClick={() => router.push(`/channel/${creator.id}`)}
            >
              <div>
                <UserAvatar
                  imageUrl={creator.imageUrl || "/user-placeholder.svg"}
                  size="sm"
                />
                <span>{creator.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <a className="flex items-center gap-2" href="/channels">
              <List size={20} />
              <span>All subscriptions</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default UserSubscriptionSection;
