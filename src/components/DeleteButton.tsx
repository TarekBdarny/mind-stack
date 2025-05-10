"use client";

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { deleteBlog } from "@/actions/blog.action";
import { toast } from "sonner";

const DeleteButton = ({ blogId }: { blogId: string }) => {
  const handleDelete = async () => {
    // Handle delete logic here
    const data = await deleteBlog(blogId);
    if (data?.success) {
      toast.success("Blog deleted successfully");
    } else {
      toast.error("Failed to delete blog");
    }
    console.log("Delete blog with ID:", blogId);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      className="cursor-pointer hover:text-destructive duration-100"
    >
      <Trash />
    </Button>
  );
};
export default DeleteButton;
