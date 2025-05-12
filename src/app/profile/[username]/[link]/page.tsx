import { getAllBlogs, getAllUserBlogs } from "@/actions/blog.action";
import { getDbUserId, getUserByUsername } from "@/actions/user.action";
import BlogCard from "@/components/BlogCard";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ link: string; username: string }>;
}) => {
  const { link, username } = await params;

  const dbUserId = await getDbUserId();
  const user = await getUserByUsername(username);
  if (!user) notFound();
  const userBlogs = await getAllUserBlogs(user.id);
  const blogs = await getAllBlogs();
  return (
    <div className="flex flex-col gap-4">
      {link === "blogs"
        ? userBlogs.map((blog, i) => (
            <BlogCard key={i} blog={blog} dbUserId={dbUserId} />
          ))
        : link === "liked"
        ? blogs
            .filter((blog) =>
              blog.likes.some((like) => like.userId === dbUserId)
            )
            .map((blog, i) => (
              <BlogCard key={i} blog={blog} dbUserId={dbUserId} />
            ))
        : blogs
            .filter((blog) =>
              blog.saved.some((save) => save.userId === dbUserId)
            )
            .map((blog, i) => (
              <BlogCard key={i} blog={blog} dbUserId={dbUserId} />
            ))}
    </div>
  );
};

export default page;
