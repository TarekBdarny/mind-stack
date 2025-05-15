"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type userData = {
  bio?: string;
  location?: string;
};

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
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            blogs: true,
          },
        },
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
export const getUserByClerkId = async (clerkId: string) => {
  if (!clerkId) return;
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          blogs: true,
        },
      },
    },
  });
};

export const getDbUserId = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
};

export const updateUser = async (data: userData) => {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await getUserByClerkId(clerkId);

    if (!user) throw new Error("User not found");

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });
    revalidatePath(`/profile/${user.username}`);
    return { success: true, updatedUser };
  } catch (error) {
    console.log("error in updateUser", error);
    throw new Error("Error updating user");
  }
};
export const getRandomUsers = async () => {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: { some: { followerId: userId } },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
    return users;
  } catch (error) {
    console.log("error in getRandomUsers", error);
  }
};
export const toggleFollow = async (targetId: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    if (existingFollow) {
      // unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetId,
          },
        },
      });
    } else {
      // follow
      await prisma.follows.create({
        data: {
          followerId: userId,
          followingId: targetId,
        },
      });
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("error in toggleFollow", error);
  }
};
export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}
export const getFollowing = async (userId: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.log("error in getFollowing", error);
  }
};
export const getFollowers = async (userId: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        following: {
          some: {
            followingId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.log("error in getFollowers", error);
  }
};
