"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { toggleFollow } from "@/actions/user.action";
import { toast } from "sonner";
import { dateFormat } from "@/lib/date";

type Props = {
  targetId: string;
  following?: boolean;
};
const FollowButton = ({ targetId, following }: Props) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollow = async () => {
    setIsFollowing(true);
    try {
      const res = await toggleFollow(targetId);
      if (!res?.success) {
        toast.error("Failed to follow user");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFollowing(false);
    }
  };
  return (
    <Button variant={"outline"} onClick={handleFollow} disabled={isFollowing}>
      {following ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
