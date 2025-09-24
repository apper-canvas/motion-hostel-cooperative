import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RoomCard = ({ room, onClick }) => {
  const getStatusVariant = (status) => {
    const variants = {
      "Available": "available",
      "Occupied": "occupied", 
      "Maintenance": "maintenance",
      "Reserved": "reserved"
    };
    return variants[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Available": "CheckCircle",
      "Occupied": "User",
      "Maintenance": "Wrench", 
      "Reserved": "Calendar"
    };
    return icons[status] || "Circle";
  };

  const getStatusBorder = (status) => {
    const borders = {
      "Available": "border-l-4 border-l-success",
      "Occupied": "border-l-4 border-l-error",
      "Maintenance": "border-l-4 border-l-warning",
      "Reserved": "border-l-4 border-l-info"
    };
    return borders[status] || "";
  };

  const amenitiesArray = typeof room.amenities_c === 'string' 
    ? room.amenities_c.split(',').map(a => a.trim()).filter(Boolean)
    : room.amenities || [];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        getStatusBorder(room.status_c || room.status)
      )}
      onClick={() => onClick?.(room)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Room {room.number_c || room.number}</h3>
            <ApperIcon name={getStatusIcon(room.status_c || room.status)} size={16} className="text-gray-500" />
          </div>
          <Badge variant={getStatusVariant(room.status_c || room.status)} size="sm">
            {room.status_c || room.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="BedDouble" size={14} className="mr-2" />
            {room.type_c || room.type}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Users" size={14} className="mr-2" />
            {room.current_occupants_c || room.currentOccupants || 0}/{room.max_occupancy_c || room.maxOccupancy} occupants
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            {room.bed_count_c || room.bedCount} beds
          </span>
          <div className="flex items-center space-x-1">
            {amenitiesArray?.slice(0, 3).map((amenity, index) => (
              <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
            {amenitiesArray?.length > 3 && (
              <span className="text-xs text-gray-500">+{amenitiesArray.length - 3}</span>
            )}
          </div>
        </div>

        {(room.status_c || room.status) === "Available" && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-success">
              <ApperIcon name="Clock" size={12} className="mr-1" />
              Ready for check-in
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default RoomCard;