"use client";

import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@clerk/nextjs";
// import { useClerk } from "@clerk/nextjs";
// import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import Image from "next/image";

const UserSubscriptionSection = () => {
  const { isSignedIn } = useAuth();
  // const router = useRouter();
  // const pathname = usePathname();
  // const clerk = useClerk();

  if (!isSignedIn) {
    return <></>;
  }

  const [userSubscriptions] = trpc.subscriptions.getMany.useSuspenseQuery();
  return (
    <SidebarGroupContent>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarMenu>
        {userSubscriptions.map(({ creator }) => (
          <SidebarMenuItem key={creator.name}>
            <SidebarMenuButton
              asChild
              size="sm"
              // isActive={}
              tooltip={creator.name}
              // onClick={() => router.push("")}
            >
              {/* <a href={item.url}> */}
              <>
                <Image src={creator.imageUrl} alt="logo" />
                <span>{creator.name}</span>
              </>
              {/* </a> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};

export default UserSubscriptionSection;
