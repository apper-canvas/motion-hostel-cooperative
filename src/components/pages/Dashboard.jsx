import React from "react";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import RoomGrid from "@/components/organisms/RoomGrid";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Monitor your hostel's real-time performance and room availability
        </p>
      </div>

      <DashboardMetrics />
      <RoomGrid />
    </div>
  );
};

export default Dashboard;