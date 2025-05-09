"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { createBlog } from "@/actions/blog.action";
import { toast } from "sonner";
import { dateFormat } from "@/lib/date";
import { useRouter } from "next/navigation";

const PostBlogButton = () => {
  const [BlogData, setBlogData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const storedData = localStorage.getItem("draft");
    setBlogData(storedData);
  }, [BlogData]);

  const handleClick = async () => {
    setLoading(true);
    try {
      await createBlog(BlogData);

      toast("Blog has been created", {
        description: dateFormat(new Date()),
      });
      localStorage.setItem("draft", "");
      setBlogData("");
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-20 h-screen">
      <Button
        type="submit"
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
