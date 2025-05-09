"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

import { createBlog } from "@/actions/blog.action";
import { toast } from "sonner";
import { dateFormat } from "@/lib/date";
import { useRouter } from "next/navigation";

const PostBlogButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    const currentBlogData = localStorage.getItem("draft");
    console.log(currentBlogData);
    try {
      const result = await createBlog(currentBlogData);
      if (result?.success) {
        toast("Blog has been created", {
          description: dateFormat(new Date()),
        });
        localStorage.setItem("draft", "");
        router.push("/");
      }
    } catch (error) {
      toast("failed to create blog");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-20 h-screen">
      <Button
        className="w-full cursor-pointer hover:-translate-y-1 transition-all duration-300 text-xl"
        size={"drop"}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Posting" : "Post"}
      </Button>
    </div>
  );
};

export default PostBlogButton;
