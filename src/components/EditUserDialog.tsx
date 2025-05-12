/* eslint-disable react/no-unescaped-entities */
"use client";

import { updateUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {  useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Pen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UserDialog({ user }: { user: User }) {
  // const { user: currentUser } = useUser();
  const [userData, setUserData] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      const result = await updateUser(userData);
      if (result?.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    } finally {
      setIsUpdating(false);
      setShowEditProfile(false);
    }
  };

  return (
    <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Pen />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input
              id="bio"
              value={userData.bio}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Location" className="text-right">
              Location
            </Label>
            <Input
              id="Location"
              value={userData.location}
              onChange={(e) =>
                setUserData({ ...userData, location: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isUpdating ? "Updating..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
