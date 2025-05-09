"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createBlog = async (content: string) => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return { success: false, message: "Unauthenticated" };

    const newBlog = await prisma.blog.create({
      data: {
        content,
        authorId: userId,
      },
    });
    revalidatePath("/");
    return { success: true, blog: newBlog };
  } catch (error) {
    console.log("error in create blog action", error);
  }
};
