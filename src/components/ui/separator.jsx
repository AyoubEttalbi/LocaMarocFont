import React from "react";

/**
 * A simple horizontal separator line for use between sections.
 */
export const Separator = ({ className = "", ...props }) => (
  <hr className={`border-t border-gray-200 my-4 ${className}`} {...props} />
);

Separator.displayName = "Separator";

export default Separator;
