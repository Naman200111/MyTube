"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import UserAvatar from "@/components/user-avatar";
import { usePathname } from "next/navigation";
import { List } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const UserSubscriptionSkeleton = () => {
  return (
    <div className="flex flex-col gap-[6px] justify-center my-1">
      <Skeleton className="w-[90%] h-6" />
      <Skeleton className="w-[90%] h-6" />
    </div>
  );
};

const UserSubscriptionSection = () => {
  const { data: userSubscriptions, isPending } =
    trpc.subscriptions.getMany.useQuery();
  const pathname = usePathname();
  const hasUserSubscriptions = (userSubscriptions || []).length > 0;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarMenu>
          {isPending && <UserSubscriptionSkeleton />}
          {hasUserSubscriptions &&
            (userSubscriptions || []).slice(0, 5).map(({ creator }) => (
              <SidebarMenuItem key={creator.id}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  className="cursor-pointer"
                  isActive={pathname.includes(creator.id)}
                  tooltip={creator.name}
                >
                  <Link href={`/user/${creator.id}`}>
                    <UserAvatar
                      imageUrl={creator.imageUrl || "/user-placeholder.svg"}
                      size="sm"
                    />
                    <span>{creator.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Link className="flex items-center gap-2" href="/channels">
                <List size={18} />
                <span>All subscriptions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default UserSubscriptionSection;
