import React from "react";

/**
 * A reusable Input component styled to match the UI kit.
 * Accepts all standard input props via ...props.
 */
export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
