import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusLegend = () => {
  const statuses = [
    { status: "Available", variant: "available", count: "Ready for check-in" },
    { status: "Occupied", variant: "occupied", count: "Currently occupied" },
    { status: "Maintenance", variant: "maintenance", count: "Under maintenance" },
    { status: "Reserved", variant: "reserved", count: "Reserved for guest" }
  ];

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Room Status Legend</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statuses.map((item) => (
          <div key={item.status} className="flex items-center space-x-2">
            <Badge variant={item.variant} size="sm">
              {item.status}
            </Badge>
            <span className="text-xs text-gray-600">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusLegend;