import React from "react";

export const Form = ({ children, className = "", ...props }) => (
  <form className={`space-y-4 ${className}`} {...props}>{children}</form>
);

export const FormField = ({ children, className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>{children}</div>
);

export const FormLabel = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>{children}</label>
);

export const FormControl = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>{children}</div>
);

export const FormDescription = ({ children, className = "", ...props }) => (
  <p className={`text-xs text-gray-500 ${className}`} {...props}>{children}</p>
);

export const FormMessage = ({ children, className = "", ...props }) => (
  <span className={`text-xs text-red-500 ${className}`} {...props}>{children}</span>
);

export const FormItem = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>{children}</div>
);

export default {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem
};
