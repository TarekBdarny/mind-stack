import CategorySelections from "@/components/CategorySelections";
import UserSidebar from "@/components/UserSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <CategorySelections />
      <div className="max-w-7xl mx-auto px-4 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3">
            <UserSidebar />
          </div>
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
