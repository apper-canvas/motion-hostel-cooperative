import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Guests = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
        <p className="text-gray-600">Manage guest profiles, check-ins, and guest services</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Users" size={40} className="text-success" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Guest Directory</h2>
          <p className="text-gray-600">Comprehensive guest management and service tracking</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Guest Profiles & History</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Check-in & Check-out Management</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Guest Communication</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Service Requests</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Guests;