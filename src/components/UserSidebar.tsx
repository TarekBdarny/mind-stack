import { getAuthUser } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { MapPinIcon, Notebook } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UserSidebar = async () => {
  const user = await getAuthUser();
  if (!user) return <UnAuthenticatedSidebar />;
  return (
    <div className="sticky top-25">
      <Card className="bg-background">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user?.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={user?.image || "/default_image.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.username}
                </p>
              </div>
            </Link>

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium"> {user?._count.following}</p>
                  {/* {user?._count.following} */}
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{user?._count.followers}</p>
                  {/* {user._count.followers} */}
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Notebook className="w-4 h-4 mr-2" />
                <p className=" text-sm text-muted-foreground">
                  {user?.bio || "No bio yet"}
                </p>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user?.location || "No location"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSidebar;

const UnAuthenticatedSidebar = () => {
  return (
    <div className="sticky top-25 ">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>
            <p className="text-center text-xl font-semibold">Welcome Back!</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4 text-muted-foreground">
            Sign in to access your profile and connect with others
          </p>
          <SignInButton mode="modal">
            <Button className="w-full cursor-pointer  hover:-translate-y-1 transition-all duration-300 ">
              Sign in
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button
              className="w-full mt-2 cursor-pointer hover:text-primary transition-all duration-200"
              variant={"outline"}
            >
              Sign up
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
};
