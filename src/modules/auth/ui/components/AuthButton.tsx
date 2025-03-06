// "use client";

import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
// import { Skeleton } from "@/components/ui/skeleton";

const AuthButton = () => {
  // const { user } = useUser();
  // console.log(user);
  return (
    <>
      <SignedIn>
        {/* {!user ? ( */}
        {/* <Skeleton className="h-[34px] w-[34px] rounded-full" />
        ) : ( */}
        <UserButton />
        {/* )} */}
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            className="flex items-center gap-1 rounded-full text-blue-600 hover:text-blue-500 text-sm shadow-none"
            variant={"outline"}
          >
            <UserCircleIcon />
            <p>Sign In</p>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
