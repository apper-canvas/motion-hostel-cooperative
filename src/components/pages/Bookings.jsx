import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import bookingService from "@/services/api/bookingService";
import guestService from "@/services/api/guestService";
import roomService from "@/services/api/roomService";

const Bookings = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [draggedBooking, setDraggedBooking] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, guestsData, roomsData] = await Promise.all([
        bookingService.getAll(),
        guestService.getAll(),
        roomService.getAll()
      ]);
      
      setBookings(bookingsData || []);
      setGuests(guestsData || []);
      setRooms(roomsData || []);
      setError(null);
    } catch (err) {
      console.error("Error loading booking data:", err);
      setError("Failed to load booking data");
      toast.error("Failed to load booking data");
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Start from Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // End at Saturday of the week containing the last day
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn).toISOString().split('T')[0];
      const checkOut = new Date(booking.checkOut).toISOString().split('T')[0];
      return dateStr >= checkIn && dateStr < checkOut;
    });
  };

  // Handle date click for quick booking
  const handleDateClick = (date) => {
    const dateBookings = getBookingsForDate(date);
    if (dateBookings.length === 0) {
      setSelectedDateRange({ start: date, end: new Date(date.getTime() + 24 * 60 * 60 * 1000) });
      setSelectedBooking(null);
      setShowBookingModal(true);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, booking) => {
    setDraggedBooking(booking);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetDate) => {
    e.preventDefault();
    if (!draggedBooking) return;

    const originalCheckIn = new Date(draggedBooking.checkIn);
    const originalCheckOut = new Date(draggedBooking.checkOut);
    const stayDuration = originalCheckOut.getTime() - originalCheckIn.getTime();
    
    const newCheckIn = targetDate;
    const newCheckOut = new Date(targetDate.getTime() + stayDuration);

    try {
      const updatedBooking = await bookingService.update(draggedBooking.Id, {
        ...draggedBooking,
        checkIn: newCheckIn.toISOString().split('T')[0],
        checkOut: newCheckOut.toISOString().split('T')[0]
      });

      setBookings(prev => prev.map(b => 
        b.Id === draggedBooking.Id ? updatedBooking : b
      ));
      
      toast.success("Booking moved successfully");
    } catch (error) {
      console.error("Error moving booking:", error);
      toast.error("Failed to move booking");
    }

    setDraggedBooking(null);
    setHoveredDate(null);
  };

  // Handle booking creation/update
  const handleBookingSubmit = async (bookingData) => {
    try {
      if (selectedBooking) {
        const updated = await bookingService.update(selectedBooking.Id, bookingData);
        setBookings(prev => prev.map(b => b.Id === selectedBooking.Id ? updated : b));
        toast.success("Booking updated successfully");
      } else {
        const created = await bookingService.create(bookingData);
        setBookings(prev => [...prev, created]);
        toast.success("Booking created successfully");
      }
      setShowBookingModal(false);
      setSelectedBooking(null);
      setSelectedDateRange(null);
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("Failed to save booking");
    }
  };

  // Handle booking status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await bookingService.updateStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.Id === bookingId ? updated : b));
      toast.success(`Booking ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading booking calendar...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ApperIcon name="AlertCircle" size={20} className="text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const calendarDays = getCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Calendar</h1>
            <p className="text-gray-600">Manage reservations and room availability</p>
          </div>
          
          <Button
            onClick={() => {
              setSelectedBooking(null);
              setSelectedDateRange(null);
              setShowBookingModal(true);
            }}
            className="bg-primary hover:bg-primary-dark"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Calendar - 70% width */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ApperIcon name="ChevronLeft" size={16} />
                  </Button>
                  
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>

              {/* Status Legend */}
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Badge variant="success" size="sm">Confirmed</Badge>
                  <Badge variant="warning" size="sm">Pending</Badge>
                  <Badge variant="info" size="sm">Inquiry</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50 border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const dateBookings = getBookingsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`h-32 border-r border-b last:border-r-0 p-1 cursor-pointer transition-colors ${
                        isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50'
                      } ${isToday ? 'bg-blue-100' : ''} ${
                        hoveredDate?.getTime() === date.getTime() ? 'bg-blue-200' : ''
                      }`}
                      onClick={() => handleDateClick(date)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date)}
                      onDragEnter={() => setHoveredDate(date)}
                      onDragLeave={() => setHoveredDate(null)}
                    >
                      <div className={`text-sm mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold' : ''}`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dateBookings.slice(0, 3).map(booking => {
                          const guest = guests.find(g => g.Id === booking.guestId);
                          const room = rooms.find(r => r.Id === booking.roomId);
                          
                          return (
                            <div
                              key={booking.Id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, booking)}
                              className={`text-xs p-1 rounded cursor-move hover:shadow-md transition-shadow ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setShowBookingModal(true);
                              }}
                              title={`${guest?.name_c || 'Unknown Guest'} - Room ${room?.number_c || 'N/A'}`}
                            >
                              <div className="font-medium truncate">
                                {guest?.name_c || 'Unknown Guest'}
                              </div>
                              <div className="text-xs opacity-75">
                                Room {room?.number_c || 'N/A'}
                              </div>
                            </div>
                          );
                        })}
                        
                        {dateBookings.length > 3 && (
                          <div className="text-xs text-gray-500 px-1">
                            +{dateBookings.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar - 30% width */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  setSelectedBooking(null);
                  setSelectedDateRange(null);
                  setShowBookingModal(true);
                }}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Booking
              </Button>

              {/* Recent Bookings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Bookings</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bookings.slice(0, 5).map(booking => {
                    const guest = guests.find(g => g.Id === booking.guestId);
                    const room = rooms.find(r => r.Id === booking.roomId);
                    
                    return (
                      <div
                        key={booking.Id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowBookingModal(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {guest?.name_c || 'Unknown Guest'}
                          </span>
                          <Badge
                            variant={
                              booking.status === 'confirmed' ? 'success' :
                              booking.status === 'pending' ? 'warning' : 'info'
                            }
                            size="sm"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          <div>Room {room?.number_c || 'N/A'}</div>
                          <div>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Summary */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Status Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confirmed</span>
                    <Badge variant="success" size="sm">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <Badge variant="warning" size="sm">
                      {bookings.filter(b => b.status === 'pending').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inquiries</span>
                    <Badge variant="info" size="sm">
                      {bookings.filter(b => b.status === 'inquiry').length}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          booking={selectedBooking}
          dateRange={selectedDateRange}
          guests={guests}
          rooms={rooms}
          onSubmit={handleBookingSubmit}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedBooking(null);
            setSelectedDateRange(null);
          }}
        />
      )}
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ booking, dateRange, guests, rooms, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    guestId: booking?.guestId || '',
    roomId: booking?.roomId || '',
    checkIn: booking?.checkIn || dateRange?.start?.toISOString().split('T')[0] || '',
    checkOut: booking?.checkOut || dateRange?.end?.toISOString().split('T')[0] || '',
    status: booking?.status || 'inquiry',
    totalAmount: booking?.totalAmount || 0,
    notes: booking?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {booking ? 'Edit Booking' : 'Create Booking'}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guest Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest
              </label>
              <select
                value={formData.guestId}
                onChange={(e) => setFormData(prev => ({ ...prev, guestId: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select Guest</option>
                {guests.map(guest => (
                  <option key={guest.Id} value={guest.Id}>
                    {guest.name_c}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData(prev => ({ ...prev, roomId: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room.Id} value={room.Id}>
                    Room {room.number_c} - {room.type_c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check In
                </label>
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check Out
                </label>
                <input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="inquiry">Inquiry</option>
                <option value="pending">Reserved</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Additional booking notes..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark">
                {booking ? 'Update' : 'Create'} Booking
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;