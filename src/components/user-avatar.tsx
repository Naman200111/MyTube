import { cva } from "class-variance-authority";
import Image from "next/image";

interface UserAvatarProps {
  imageUrl: string;
  size?: "default" | "sm" | "xs" | "lg" | "xl" | "xxl" | "xxxl";
  className?: string;
}

const avatarVariants = cva("relative", {
  variants: {
    size: {
      xs: "h-4 min-w-4",
      sm: "h-6 min-w-6",
      default: "h-7 min-w-7",
      lg: "h-8 min-w-8",
      xl: "h-16 min-w-16",
      xxl: "h-[100px] w-[100px]",
      xxxl: "h-[150px] w-[150px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const UserAvatar = ({
  size = "default",
  imageUrl,
  className,
}: UserAvatarProps) => {
  return (
    <div className={avatarVariants({ className, size })}>
      <Image
        src={imageUrl}
        alt="User Avatar"
        fill
        className="object-cover rounded-full"
      />
    </div>
  );
};

export default UserAvatar;
