import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", size = "md", children, ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
    available: "bg-success/10 text-success border border-success/20",
    occupied: "bg-error/10 text-error border border-error/20",
    maintenance: "bg-warning/10 text-warning border border-warning/20",
    reserved: "bg-info/10 text-info border border-info/20",
    confirmed: "bg-success/10 text-success border border-success/20",
    pending: "bg-warning/10 text-warning border border-warning/20",
    inquiry: "bg-info/10 text-info border border-info/20",
    cancelled: "bg-error/10 text-error border border-error/20"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;