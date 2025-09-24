import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "neutral",
  gradient = false,
  subtitle
}) => {
  const trendColors = {
    up: "text-success",
    down: "text-error", 
    neutral: "text-secondary"
  };

  const gradients = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-100",
    green: "bg-gradient-to-br from-green-50 to-emerald-100",
    amber: "bg-gradient-to-br from-amber-50 to-orange-100",
    red: "bg-gradient-to-br from-red-50 to-rose-100"
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg hover:-translate-y-1", gradient && gradients[gradient])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            gradient ? "bg-white/80 backdrop-blur-sm" : "bg-slate-100"
          )}>
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
          {change && (
            <div className={cn("flex items-center text-sm font-medium", trendColors[trend])}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                size={16} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
          {subtitle && (
            <div className="text-xs text-gray-500">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;