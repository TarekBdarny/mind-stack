import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
