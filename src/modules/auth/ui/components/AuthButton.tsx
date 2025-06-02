"use client";

import { Button } from "@/components/ui/button";
import { UserCircleIcon, VideoIcon } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              href="/studio"
              label="Studio"
              labelIcon={<VideoIcon className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
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
