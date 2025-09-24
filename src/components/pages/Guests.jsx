import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import guestService from "@/services/api/guestService";
import roomService from "@/services/api/roomService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

// Input Components
const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

// Guest List Item Component
const GuestListItem = ({ guest, isSelected, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'checked-in': return 'success';
      case 'reserved': return 'warning';
      case 'checked-out': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
        isSelected ? "border-primary bg-blue-50" : "border-gray-200"
      )}
      onClick={() => onClick(guest)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{guest.name_c || guest.Name || 'Unnamed Guest'}</h3>
          <p className="text-sm text-gray-600">{guest.email_c || 'No email'}</p>
        </div>
        <Badge variant={getStatusVariant(guest.status_c)} size="sm">
          {guest.status_c || 'unknown'}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="Calendar" size={12} className="mr-1" />
          <span>In: {formatDate(guest.check_in_c)}</span>
        </div>
        <div className="flex items-center">
          <ApperIcon name="Calendar" size={12} className="mr-1" />
          <span>Out: {formatDate(guest.check_out_c)}</span>
        </div>
        {guest.room_id_c?.Name && (
          <div className="flex items-center">
            <ApperIcon name="BedDouble" size={12} className="mr-1" />
            <span>Room: {guest.room_id_c.Name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Guest List Component
const GuestList = ({ guests, selectedGuest, onSelectGuest, searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = !searchTerm || 
      (guest.name_c || guest.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.email_c || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || guest.status_c === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="checked-in">Checked In</option>
          <option value="reserved">Reserved</option>
          <option value="checked-out">Checked Out</option>
        </Select>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Users" size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No guests found</p>
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <GuestListItem
              key={guest.Id}
              guest={guest}
              isSelected={selectedGuest?.Id === guest.Id}
              onClick={onSelectGuest}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Check-in Form Component
const CheckInForm = ({ onSave, onCancel, availableRooms }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    email_c: '',
    phone_c: '',
    nationality_c: '',
    id_document_c: '',
    room_id_c: '',
    check_in_c: '',
    check_out_c: '',
    status_c: 'checked-in'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c || !formData.email_c) {
      toast.error('Name and email are required');
      return;
    }
    
    if (!formData.room_id_c) {
      toast.error('Please select a room');
      return;
    }

    try {
      setLoading(true);
      const guestData = {
        ...formData,
        room_id_c: parseInt(formData.room_id_c)
      };
      
      const result = await guestService.create(guestData);
      toast.success('Guest checked in successfully');
      onSave(result);
    } catch (error) {
      console.error('Error creating guest:', error);
      toast.error(error.message || 'Failed to check in guest');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <Input
            type="text"
            value={formData.name_c}
            onChange={(e) => handleChange('name_c', e.target.value)}
            placeholder="Enter guest name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email_c}
            onChange={(e) => handleChange('email_c', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            type="text"
            value={formData.phone_c}
            onChange={(e) => handleChange('phone_c', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <Input
            type="text"
            value={formData.nationality_c}
            onChange={(e) => handleChange('nationality_c', e.target.value)}
            placeholder="Enter nationality"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Document
          </label>
          <Input
            type="text"
            value={formData.id_document_c}
            onChange={(e) => handleChange('id_document_c', e.target.value)}
            placeholder="Enter ID document number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room *
          </label>
          <Select
            value={formData.room_id_c}
            onChange={(e) => handleChange('room_id_c', e.target.value)}
            required
          >
            <option value="">Select a room</option>
            {availableRooms.map(room => (
              <option key={room.Id} value={room.Id}>
                {room.Name} - {room.type_c || 'Room'} ({room.current_occupants_c || 0}/{room.max_occupancy_c || 4} occupied)
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
          </label>
          <Input
            type="date"
            value={formData.check_in_c}
            onChange={(e) => handleChange('check_in_c', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
          </label>
          <Input
            type="date"
            value={formData.check_out_c}
            onChange={(e) => handleChange('check_out_c', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Checking In...' : 'Complete Check-in'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Guest Profile Component
const GuestProfile = ({ guest, onEdit, onStatusChange }) => {
  const [changingStatus, setChangingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setChangingStatus(true);
      await guestService.updateStatus(guest.Id, newStatus);
      toast.success(`Guest status updated to ${newStatus}`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setChangingStatus(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'checked-in': return 'success';
      case 'reserved': return 'warning';
      case 'checked-out': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {guest.name_c || guest.Name || 'Unnamed Guest'}
          </h2>
          <p className="text-gray-600">{guest.email_c || 'No email provided'}</p>
        </div>
        <Badge variant={getStatusVariant(guest.status_c)} size="lg">
          {guest.status_c || 'unknown'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Contact Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Phone</span>
              <p className="font-medium">{guest.phone_c || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Nationality</span>
              <p className="font-medium">{guest.nationality_c || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">ID Document</span>
              <p className="font-medium">{guest.id_document_c || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Stay Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Room</span>
              <p className="font-medium">
                {guest.room_id_c?.Name || 'No room assigned'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Check-in Date</span>
              <p className="font-medium">{formatDate(guest.check_in_c)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Check-out Date</span>
              <p className="font-medium">{formatDate(guest.check_out_c)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onEdit} leftIcon="Edit">
          Edit Guest
        </Button>
        {guest.status_c === 'reserved' && (
          <Button
            onClick={() => handleStatusChange('checked-in')}
            disabled={changingStatus}
            leftIcon="UserPlus"
          >
            Check In
          </Button>
        )}
        {guest.status_c === 'checked-in' && (
          <Button
            onClick={() => handleStatusChange('checked-out')}
            disabled={changingStatus}
            variant="outline"
            leftIcon="UserMinus"
          >
            Check Out
          </Button>
        )}
      </div>
    </div>
  );
};

// Guest Actions Component
const GuestActions = ({ onNewCheckIn, selectedGuest, onDeleteGuest }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedGuest) return;
    
    if (confirm(`Are you sure you want to delete ${selectedGuest.name_c || selectedGuest.Name}?`)) {
      try {
        setDeleting(true);
        await guestService.delete(selectedGuest.Id);
        toast.success('Guest deleted successfully');
        onDeleteGuest();
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast.error('Failed to delete guest');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button 
            onClick={onNewCheckIn}
            className="w-full"
            leftIcon="UserPlus"
          >
            New Check-in
          </Button>
          
          {selectedGuest && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              leftIcon="Trash2"
            >
              {deleting ? 'Deleting...' : 'Delete Guest'}
            </Button>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Guest Statistics</h3>
        <div className="text-sm text-gray-600">
          <p>Active check-ins and reservations</p>
        </div>
      </div>
    </div>
  );
};

// Main Guests Component
const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await guestService.getAll();
      setGuests(data);
    } catch (err) {
      setError("Failed to load guest data");
      toast.error("Failed to load guests");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRooms = useCallback(async () => {
    try {
      const roomData = await roomService.getAll();
      // Filter for available rooms (not fully occupied)
      const availableRooms = roomData.filter(room => {
        const current = parseInt(room.current_occupants_c) || 0;
        const max = parseInt(room.max_occupancy_c) || 4;
        return current < max && room.status_c === 'available';
      });
      setRooms(availableRooms);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }, []);

  useEffect(() => {
    loadGuests();
    loadRooms();
  }, [loadGuests, loadRooms]);

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
    setShowCheckInForm(false);
  };

  const handleNewCheckIn = () => {
    setShowCheckInForm(true);
    setSelectedGuest(null);
  };

  const handleCheckInSave = (newGuest) => {
    setShowCheckInForm(false);
    loadGuests();
    loadRooms(); // Refresh room availability
    setSelectedGuest(newGuest);
  };

  const handleCheckInCancel = () => {
    setShowCheckInForm(false);
  };

  const handleEditGuest = () => {
    // Implement edit functionality here
    toast.info('Edit functionality coming soon');
  };

  const handleStatusChange = () => {
    loadGuests();
    loadRooms(); // Refresh room availability
  };

  const handleDeleteGuest = () => {
    setSelectedGuest(null);
    loadGuests();
    loadRooms(); // Refresh room availability
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadGuests} />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Management</h1>
        <p className="text-gray-600">Manage guest profiles, check-ins, and guest services</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Guest List - Left Panel (25%) */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Guests</h2>
              <p className="text-sm text-gray-600">{guests.length} total</p>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <GuestList
                guests={guests}
                selectedGuest={selectedGuest}
                onSelectGuest={handleSelectGuest}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Center Panel (45%) */}
        <div className="col-span-6">
          <Card className="h-full">
            <CardContent className="p-6">
              {showCheckInForm ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    New Guest Check-in
                  </h2>
                  <CheckInForm
                    onSave={handleCheckInSave}
                    onCancel={handleCheckInCancel}
                    availableRooms={rooms}
                  />
                </div>
              ) : selectedGuest ? (
                <GuestProfile
                  guest={selectedGuest}
                  onEdit={handleEditGuest}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <ApperIcon name="Users" size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a guest or start a new check-in
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a guest from the list to view their profile or check in a new guest
                    </p>
                    <Button onClick={handleNewCheckIn} leftIcon="UserPlus">
                      New Check-in
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel - Right Panel (30%) */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            </CardHeader>
            <CardContent>
              <GuestActions
                onNewCheckIn={handleNewCheckIn}
                selectedGuest={selectedGuest}
                onDeleteGuest={handleDeleteGuest}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Guests;