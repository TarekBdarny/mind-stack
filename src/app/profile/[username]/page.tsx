import { getUserByUsername } from "@/actions/user.action";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { username } = params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  return <div>profile page for {username}</div>;
};

export default page;
