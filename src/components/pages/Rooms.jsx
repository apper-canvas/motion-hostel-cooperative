import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Rooms = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
        <p className="text-gray-600">Manage room details, maintenance, and configurations</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="BedDouble" size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Room Management</h2>
          <p className="text-gray-600">This section will include comprehensive room management features</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Room Details & Configuration</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Maintenance Scheduling</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Amenity Management</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Bed Configuration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rooms;