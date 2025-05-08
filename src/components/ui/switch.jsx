import React from "react";

/**
 * A reusable Switch component styled to match the UI kit.
 * Accepts checked, onChange, and all standard input props via ...props.
 */
export const Switch = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="sr-only peer"
        {...props}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-500 transition relative">
        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
});

Switch.displayName = "Switch";

export default Switch;
