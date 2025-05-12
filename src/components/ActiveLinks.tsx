"use client";
import { activeLinks } from "@/lib/constans";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ActiveLinks = ({ username }: { username: string }) => {
  const pathname = usePathname();
  const lastLinkSegment = pathname.split("/").pop();
  return (
    <div className="flex items-center gap-4 ">
      {activeLinks.map((activeLink, i) => (
        <Link
          key={i}
          href={`/profile/${username}/${activeLink.label}`}
          className={`${
            activeLink.label === lastLinkSegment &&
            "underline decoration-primary underline-offset-2 font-semibold"
          } text-xl font-medium`}
        >
          {activeLink.text}
        </Link>
      ))}
    </div>
  );
};

export default ActiveLinks;
