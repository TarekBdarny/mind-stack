import CategorySelections from "@/components/CategorySelections";
import UserSidebar from "@/components/UserSidebar";

import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <CategorySelections />
      <div className="w-full lg:max-w-3/4 md:mx-auto px-4 mt-3">
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3">
            <UserSidebar />
          </div>

          <div className="w-[400px] sm:w-[700px] md:w-[900px] pr-4 lg:pr-0 lg:w-full  lg:col-span-9 ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
