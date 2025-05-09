import Tiptap from "@/components/WriteCommands";
import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const page = async () => {
  return (
    <div
      className={`  w-md lg:w-3xl min-w-md mx-auto lg:mx-auto ${poppins.className} `}
    >
      <Tiptap />
    </div>
  );
};

export default page;
