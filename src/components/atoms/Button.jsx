import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  loading,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg",
    warning: "bg-gradient-to-r from-warning to-amber-600 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg",
    error: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:-translate-y-0.5 active:translate-y-0",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:transform-none",
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
      ) : leftIcon ? (
        <ApperIcon name={leftIcon} size={16} className="mr-2" />
      ) : null}
      {children}
      {rightIcon && !loading && (
        <ApperIcon name={rightIcon} size={16} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;