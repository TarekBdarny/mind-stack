import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function UserAvatar() {
  const { user } = useUser();

  return (
    <Avatar className="">
      <AvatarImage src={user?.imageUrl || "/default_image.png"} />
      <AvatarFallback>{user?.username}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
