import { getUserByUsername } from "@/actions/user.action";
import { notFound } from "next/navigation";
import React from "react";
import ProfileUI from "./ProfileUI";
import ProfilePageSidebar from "@/components/ProfilePageSidebar";
import ActiveLinks from "@/components/ActiveLinks";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ link: string; username: string }>;
};
const Layout = async ({ children, params }: LayoutProps) => {
  const { username } = await params;
  console.log(username);
  //   const dbUserId = await getDbUserId();
  const user = await getUserByUsername(username);
  if (!user) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ProfileUI user={user} />
      <div className="w-full flex items-center justify-center gap-10 mb-5">
        <ActiveLinks username={username} />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6">
        {/* SEP */}
        <ProfilePageSidebar user={user} />
        <div className="flex flex-col gap-4 w-full overflow-x-hidden ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
