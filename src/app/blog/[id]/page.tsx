import { getBlogById } from "@/actions/blog.action";
import { getDbUserId } from "@/actions/user.action";
import BlogCard from "@/components/BlogCard";

import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await getBlogById(id);
  const dbUserId = await getDbUserId();
  return <BlogCard blog={blog} dbUserId={dbUserId} use="separate" />;
};

export default page;

{
  /* <div className="w-full">
        <div className="w-1/2 flex flex-col">
          <h1 className="break-words">{blog?.blog?.title}</h1>
        </div>
        <div>
          <Avatar>
            <AvatarImage
              src={blog?.blog?.author.image || "default_image.png"}
              alt="Profile image"
            />
            <AvatarFallback>
              {blog?.blog?.author.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div> */
}
