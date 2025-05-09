"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const registerUserToDB = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        image: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("error in registerUserToDB", error);
  }
};
export const getAuthUser = async () => {
  try {
    const { userId } = await auth();

    if (!userId) return;

    const authUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!authUser) return;
    return authUser;
  } catch (error) {
    console.log("error in getAthUser", error);
  }
};
export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            blogs: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.log("error in getUserByUsername", error);
  }
};
