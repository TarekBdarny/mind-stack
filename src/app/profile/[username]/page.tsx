import { getAllUserBlogs } from "@/actions/blog.action";
import { getDbUserId, getUserByUsername } from "@/actions/user.action";
import BlogCard from "@/components/BlogCard";
import { notFound } from "next/navigation";

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
    <>
      {userBlogs.map((blog, i) => (
        <BlogCard key={i} blog={blog} dbUserId={dbUserId} />
      ))}
    </>
  );
};

export default page;
