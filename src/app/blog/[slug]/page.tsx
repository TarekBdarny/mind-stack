import { getBlogById, getBlogsByCategory } from "@/actions/blog.action";
import { getDbUserId } from "@/actions/user.action";
import BlogCard from "@/components/BlogCard";
import CategorySelections from "@/components/CategorySelections";

import { containsBothNumbersAndLetters } from "@/lib/helpers";
import React from "react";
type Blogs = Awaited<ReturnType<typeof getBlogsByCategory>>;

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const dbUserId = await getDbUserId();
  if (containsBothNumbersAndLetters(slug)) {
    const blog = await getBlogById(slug);
    if (!blog) return;

    return <BlogCard blog={blog} dbUserId={dbUserId} use="separate" />;
    // Handle id route
  } else {
    const blogs: Blogs = await getBlogsByCategory(slug);
    return (
      <div className="min-w-full max-w-3/4 mx-auto px-4 flex flex-col gap-4">
        <div className="items-start">
          <CategorySelections />
        </div>

        {blogs?.length === 0 ? (
          <h1>No Blogs Found for category {slug}</h1>
        ) : (
          blogs?.map((blog, index) => (
            <BlogCard key={index} blog={blog} dbUserId={dbUserId} use="group" />
          ))
        )}
      </div>
    );
  }
};

export default page;
