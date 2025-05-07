import CategorySelections from "@/components/CategorySelections";
import UserSidebar from "@/components/UserSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <CategorySelections />
      <div className="mt-10">
        <UserSidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
