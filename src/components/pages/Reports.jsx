import React from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Comprehensive insights and performance analytics</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-50 to-violet-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="BarChart3" size={40} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Intelligence</h2>
          <p className="text-gray-600">Data-driven insights for informed decision making</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Occupancy Analytics</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Revenue Reporting</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Guest Satisfaction Metrics</span>
            </div>
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
              <span className="text-sm font-medium">Performance Dashboards</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;