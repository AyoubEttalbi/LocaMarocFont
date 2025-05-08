import React from "react";

export const Tabs = ({ children, className = "", ...props }) => (
  <div className={`border-b border-gray-200 ${className}`} {...props}>{children}</div>
);

export const TabsList = ({ children, className = "", ...props }) => (
  <div className={`flex space-x-2 ${className}`} {...props}>{children}</div>
);

export const TabsTrigger = ({ children, active, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-t-md font-medium focus:outline-none transition border-b-2 ${active ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>{children}</div>
);

export default { Tabs, TabsList, TabsTrigger, TabsContent };
