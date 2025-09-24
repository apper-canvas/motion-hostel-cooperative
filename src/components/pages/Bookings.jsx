import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Bookings = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">Handle reservations, availability, and booking operations</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Calendar" size={40} className="text-warning" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Reservation System</h2>
          <p className="text-gray-600">Complete booking and reservation management platform</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Reservation Calendar</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Availability Management</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Booking Confirmation</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Payment Processing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;