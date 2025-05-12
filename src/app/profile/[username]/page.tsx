import { getAllUserBlogs } from "@/actions/blog.action";
import { getDbUserId, getUserByUsername } from "@/actions/user.action";
import BlogCard from "@/components/BlogCard";
import { notFound } from "next/navigation";
import React from "react";
import ProfileUI from "./ProfileUI";
import ProfilePageSidebar from "@/components/ProfilePageSidebar";

export type UserProps = {
  user: {
    id: string;
    name: string | null;
    username: string;
    bio: string | null;
    image: string | null;
    location: string | null;
    createdAt: Date;
    _count: {
      followers: number;
      following: number;
      blogs: number;
    };
  };
};

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const dbUserId = await getDbUserId();
  const user = await getUserByUsername(username);
  if (!user) notFound();
  const userBlogs = await getAllUserBlogs(user.id);
  return (
    <div className="max-w-7xl mx-auto px-4  ">
      <ProfileUI user={user} />
      <div className="w-full flex items-center justify-center gap-10 mb-5">
        <h1>Blogs</h1>
        <h1>Liked</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-6">
        {/* SEP */}
        <ProfilePageSidebar user={user} />
        <div className="flex flex-col gap-4 w-full overflow-x-hidden">
          {userBlogs.map((blog, i) => (
            <BlogCard key={i} blog={blog} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
