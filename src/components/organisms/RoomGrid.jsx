import React, { useState, useEffect } from "react";
import RoomCard from "@/components/molecules/RoomCard";
import StatusLegend from "@/components/molecules/StatusLegend";
import roomService from "@/services/api/roomService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const RoomGrid = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRooms, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRoomClick = (room) => {
    toast.info(`Room ${room.number} details - ${room.status}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRooms} />;
  if (!rooms.length) {
    return (
      <Empty 
        title="No rooms available"
        description="No room data found. Please check your system configuration."
        icon="BedDouble"
      />
    );
  }

const roomsByStatus = rooms.reduce((acc, room) => {
    const status = room.status_c || room.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Room Availability</h2>
          <p className="text-sm text-gray-600">
            Real-time room status • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-slate-200">
          {rooms.length} total rooms
        </div>
      </div>

      <StatusLegend />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.Id}
            room={room}
            onClick={handleRoomClick}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Room Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(roomsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;