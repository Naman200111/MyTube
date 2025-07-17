import UserPageView from "@/modules/home/ui/views/user-page-view";
import { trpc } from "@/trpc/server";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

export const dynamic = "force-dynamic";

const UserPage = async ({ params }: UserPageProps) => {
  const { userId } = await params;
  void trpc.users.getOne.prefetch({ userId });
  void trpc.videos.getManyFromQuery.prefetchInfinite({ userId, limit: 5 });

  return <UserPageView userId={userId} />;
};

export default UserPage;
