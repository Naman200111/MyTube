import UserPageSection from "../sections/user-page-section";

interface UserPageViewProps {
  userId: string;
}

const UserPageView = ({ userId }: UserPageViewProps) => {
  return (
    <div className="max-w-[960px] overflow-hidden w-[100%] mx-auto">
      {/* <div className="mx-2">
        <p className="text-2xl font-bold">All subscriptions</p>
      </div>
      <div className="h-[1px] bg-gray-200 my-4 mx-2"></div> */}
      <UserPageSection userId={userId} />
    </div>
  );
};

export default UserPageView;
