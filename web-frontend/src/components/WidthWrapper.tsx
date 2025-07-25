import React, { ReactNode } from "react";

const WidthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full">
      <div className="w-full container mx-auto px-4 md:px-6 lg:px-0">
        {children}
      </div>
    </div>
  );
};

export default WidthWrapper;