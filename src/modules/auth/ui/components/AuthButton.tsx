import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

const AuthButton = () => {
  return (
    <Button
      className="flex items-center gap-1 rounded-full text-blue-600 hover:text-blue-500 text-sm shadow-none"
      variant={"outline"}
    >
      <UserCircleIcon />
      <p>Sign In</p>
    </Button>
  );
};

export default AuthButton;
