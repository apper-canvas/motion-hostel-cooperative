import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import roomService from "@/services/api/roomService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
      className
    )}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none",
      className
    )}
    {...props}
  />
);

const RoomListItem = ({ room, isSelected, onClick }) => {
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

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={() => onClick(room)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Room {room.number}</h3>
          <Badge variant={getStatusVariant(room.status)} size="sm">
            {room.status}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="BedDouble" size={14} className="mr-2" />
            {room.type}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Users" size={14} className="mr-2" />
            {room.currentOccupants}/{room.maxOccupancy} occupants
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name={getStatusIcon(room.status)} size={14} className="mr-2" />
            {room.bedCount} beds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RoomForm = ({ room, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    number: room?.number || "",
    type: room?.type || "4-Bed Dorm",
    bedCount: room?.bedCount || 4,
    maxOccupancy: room?.maxOccupancy || 4,
    amenities: room?.amenities?.join(", ") || "WiFi, AC, Locker, Bathroom",
    bathroomType: room?.bathroomType || "Shared",
    windowView: room?.windowView || "Interior",
    baseRatePerBed: room?.pricing?.baseRatePerBed || 25,
    privateRoomRate: room?.pricing?.privateRoomRate || 80,
    seasonalAdjustment: room?.pricing?.seasonalAdjustment || 0,
    status: room?.status || "Available"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const roomData = {
        ...formData,
        bedCount: parseInt(formData.bedCount),
        maxOccupancy: parseInt(formData.maxOccupancy),
        amenities: formData.amenities.split(",").map(a => a.trim()).filter(Boolean),
        pricing: {
          baseRatePerBed: parseFloat(formData.baseRatePerBed),
          privateRoomRate: parseFloat(formData.privateRoomRate),
          seasonalAdjustment: parseFloat(formData.seasonalAdjustment)
        },
        currentOccupants: room?.currentOccupants || 0
      };

      const result = isEditing 
        ? await roomService.update(room.Id, roomData)
        : await roomService.create(roomData);

      toast.success(`Room ${isEditing ? 'updated' : 'created'} successfully`);
      onSave(result);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Number
          </label>
          <Input
            value={formData.number}
            onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            placeholder="e.g., 101"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="4-Bed Dorm">4-Bed Dorm</option>
            <option value="6-Bed Dorm">6-Bed Dorm</option>
<option value="8-Bed Dorm">8-Bed Dorm</option>
            <option value="Private Room">Private Room</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathroom Type
          </label>
          <Select
            value={formData.bathroomType}
            onChange={(e) => setFormData(prev => ({ ...prev, bathroomType: e.target.value }))}
            required
          >
            <option value="Shared">Shared</option>
            <option value="Private">Private</option>
            <option value="En-suite">En-suite</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Window View
          </label>
          <Select
            value={formData.windowView}
            onChange={(e) => setFormData(prev => ({ ...prev, windowView: e.target.value }))}
            required
          >
            <option value="Interior">Interior</option>
            <option value="City">City View</option>
            <option value="Garden">Garden View</option>
            <option value="Street">Street View</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bed Count
          </label>
          <Input
            type="number"
            min="1"
            max="12"
            value={formData.bedCount}
            onChange={(e) => setFormData(prev => ({ ...prev, bedCount: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Occupancy
          </label>
          <Input
            type="number"
            min="1"
            max="12"
            value={formData.maxOccupancy}
            onChange={(e) => setFormData(prev => ({ ...prev, maxOccupancy: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          required
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Reserved">Reserved</option>
        </Select>
</div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing Configuration</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Rate per Bed ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.baseRatePerBed}
              onChange={(e) => setFormData(prev => ({ ...prev, baseRatePerBed: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Private Room Rate ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.privateRoomRate}
              onChange={(e) => setFormData(prev => ({ ...prev, privateRoomRate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seasonal Adjustment (%)
            </label>
            <Input
              type="number"
              step="1"
              min="-50"
              max="100"
              value={formData.seasonalAdjustment}
              onChange={(e) => setFormData(prev => ({ ...prev, seasonalAdjustment: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities (comma separated)
        </label>
        <Textarea
          rows={3}
          value={formData.amenities}
          onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
          placeholder="WiFi, AC, Locker, Bathroom, TV"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities (comma separated)
        </label>
        <Textarea
          rows={3}
          value={formData.amenities}
          onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
          placeholder="WiFi, AC, Locker, Bathroom, TV"
        />
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button type="submit" loading={loading} className="flex-1">
          {isEditing ? 'Update Room' : 'Create Room'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const RoomDetails = ({ room, onEdit, onStatusChange }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await roomService.updateStatus(room.Id, newStatus);
      toast.success(`Room ${room.number} status updated to ${newStatus}`);
      onStatusChange();
    } catch (error) {
      toast.error(`Failed to update room status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Available": "available",
      "Occupied": "occupied",
      "Maintenance": "maintenance",
      "Reserved": "reserved"
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room {room.number}</h2>
<p className="text-gray-600">{room.type} • {room.bathroomType} Bathroom • {room.windowView}</p>
        </div>
        <div className="text-right">
          <Badge variant={getStatusVariant(room.status)} size="lg">
            {room.status}
          </Badge>
          <div className="text-sm text-gray-600 mt-1">
            ${room.pricing?.baseRatePerBed}/bed • ${room.pricing?.privateRoomRate}/private
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Room Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="BedDouble" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {room.bedCount} beds ({room.type})
                </span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Users" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {room.currentOccupants}/{room.maxOccupancy} occupants
                </span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Updated {new Date(room.lastUpdated).toLocaleDateString()}
                </span>
</div>
              <div className="flex items-center">
                <ApperIcon name="DollarSign" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  ${room.pricing?.baseRatePerBed}/bed • ${room.pricing?.privateRoomRate}/private
                  {room.pricing?.seasonalAdjustment !== 0 && (
                    <span className="ml-2 text-xs text-blue-600">
                      ({room.pricing?.seasonalAdjustment > 0 ? '+' : ''}{room.pricing?.seasonalAdjustment}% seasonal)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
</Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Room Features</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="Bath" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">{room.bathroomType} Bathroom</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Eye" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">{room.windowView} View</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="DollarSign" size={16} className="mr-3 text-gray-500" />
                <div className="text-sm text-gray-600">
                  <div>Bed rate: ${room.pricing?.baseRatePerBed}/night</div>
                  <div>Private rate: ${room.pricing?.privateRoomRate}/night</div>
                  {room.pricing?.seasonalAdjustment !== 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      Seasonal: {room.pricing?.seasonalAdjustment > 0 ? '+' : ''}{room.pricing?.seasonalAdjustment}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Status
              </label>
              <div className="flex space-x-2">
                {["Available", "Occupied", "Maintenance", "Reserved"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={room.status === status ? "primary" : "secondary"}
                    onClick={() => handleStatusChange(status)}
                    disabled={room.status === status || updatingStatus}
                    loading={updatingStatus && room.status !== status}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <Button onClick={onEdit} leftIcon="Edit" className="w-full">
                Edit Room Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
      
      // Update selected room if it exists
      if (selectedRoom) {
        const updatedSelected = data.find(r => r.Id === selectedRoom.Id);
        if (updatedSelected) {
          setSelectedRoom(updatedSelected);
        }
      }
    } catch (err) {
      setError("Failed to load room data");
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleAddRoom = () => {
    setShowForm(true);
    setSelectedRoom(null);
    setEditingRoom(null);
  };

  const handleEditRoom = () => {
    setEditingRoom(selectedRoom);
    setShowForm(true);
  };

  const handleFormSave = (savedRoom) => {
    loadRooms();
    setShowForm(false);
    setEditingRoom(null);
    setSelectedRoom(savedRoom);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRooms} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
        <p className="text-gray-600">Manage room details, maintenance, and configurations</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Room List (40%) */}
        <div className="w-2/5 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rooms</h2>
                <Button onClick={handleAddRoom} leftIcon="Plus" size="sm">
                  Add Room
                </Button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <ApperIcon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search rooms..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Reserved">Reserved</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredRooms.map((room) => (
              <RoomListItem
                key={room.Id}
                room={room}
                isSelected={selectedRoom?.Id === room.Id}
                onClick={handleRoomClick}
              />
            ))}
            {filteredRooms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Search" size={48} className="mx-auto mb-2 opacity-50" />
                <p>No rooms found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Details/Form (60%) */}
        <div className="flex-1">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-y-auto">
              {showForm ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                  </h2>
                  <RoomForm
                    room={editingRoom}
                    onSave={handleFormSave}
                    onCancel={handleFormCancel}
                    isEditing={!!editingRoom}
                  />
                </div>
              ) : selectedRoom ? (
                <RoomDetails
                  room={selectedRoom}
                  onEdit={handleEditRoom}
                  onStatusChange={loadRooms}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <ApperIcon name="BedDouble" size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a room to view details
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a room from the list to view and edit its details
                    </p>
                    <Button onClick={handleAddRoom} leftIcon="Plus">
                      Add New Room
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rooms;