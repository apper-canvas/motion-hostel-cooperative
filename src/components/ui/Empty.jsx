import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "There's nothing to show right now", 
  action = null,
  icon = "Inbox"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name={icon} size={40} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        </div>
        
        {action && (
          <div className="space-y-4">
            {action}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <ApperIcon name="Info" size={16} className="inline mr-2" />
            Get started by adding your first entry
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empty;