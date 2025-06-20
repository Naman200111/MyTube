import { mergeClasses } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  imageUrl: string;
  size?: "default" | "sm";
  className?: string;
}

const dimensionMap = {
  default: { width: 40, height: 30 },
  // todos fix size for replies
  sm: { width: 30, height: 20 },
};

const UserAvatar = ({
  size = "default",
  imageUrl,
  className,
}: UserAvatarProps) => {
  return (
    <Image
      src={imageUrl}
      alt="User Avatar"
      width={dimensionMap[size].width}
      height={dimensionMap[size].height}
      className={mergeClasses("rounded-full", className)}
    />
  );
};

export default UserAvatar;
