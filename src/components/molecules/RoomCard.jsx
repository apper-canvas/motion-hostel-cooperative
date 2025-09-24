import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

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

  // Amenities are now consistently provided as arrays from service
  const amenitiesArray = room.amenities || [];
  
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-gray-50 border border-gray-200 rounded-lg",
        getStatusBorder(room.status)
      )}
      onClick={() => onClick?.(room)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
            <ApperIcon name={getStatusIcon(room.status)} size={16} className="text-gray-500" />
          </div>
          <Badge variant={getStatusVariant(room.status)} size="sm">
            {room.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <ApperIcon name="BedDouble" size={14} className="mr-2" />
            {room.type}
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <ApperIcon name="Users" size={14} className="mr-2" />
            {room.currentOccupants || 0}/{room.maxOccupancy} occupants
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <ApperIcon name="Bed" size={14} className="mr-2" />
            {room.bedCount} beds
          </div>
          <div className="flex items-center gap-1 mt-2">
            {amenitiesArray?.slice(0, 3).map((amenity, index) => (
              <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
            {amenitiesArray?.length > 3 && (
              <span className="text-xs text-gray-500">+{amenitiesArray.length - 3}</span>
            )}
          </div>
        </div>
        
        {room.status === "Available" && (
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