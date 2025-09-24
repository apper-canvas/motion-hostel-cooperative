class BookingService {
  constructor() {
    this.mockData = [
      {
        Id: 1,
        guestId: 1,
        roomId: 101,
        checkIn: "2024-12-18",
        checkOut: "2024-12-22",
        status: "confirmed",
        totalAmount: 200.00,
        notes: "Early check-in requested",
        createdAt: "2024-12-15T10:00:00Z",
        updatedAt: "2024-12-15T10:00:00Z"
      },
      {
        Id: 2,
        guestId: 2,
        roomId: 102,
        checkIn: "2024-12-19",
        checkOut: "2024-12-21",
        status: "pending",
        totalAmount: 150.00,
        notes: "Waiting for payment confirmation",
        createdAt: "2024-12-16T14:30:00Z",
        updatedAt: "2024-12-16T14:30:00Z"
      },
      {
        Id: 3,
        guestId: 3,
        roomId: 103,
        checkIn: "2024-12-20",
        checkOut: "2024-12-25",
        status: "confirmed",
        totalAmount: 375.00,
        notes: "Extended stay guest",
        createdAt: "2024-12-14T09:15:00Z",
        updatedAt: "2024-12-17T11:20:00Z"
      },
      {
        Id: 4,
        guestId: 4,
        roomId: 104,
        checkIn: "2024-12-16",
        checkOut: "2024-12-18",
        status: "confirmed",
        totalAmount: 100.00,
        notes: "Business traveler",
        createdAt: "2024-12-12T16:45:00Z",
        updatedAt: "2024-12-12T16:45:00Z"
      },
      {
        Id: 5,
        guestId: 5,
        roomId: 105,
        checkIn: "2024-12-21",
        checkOut: "2024-12-24",
        status: "inquiry",
        totalAmount: 225.00,
        notes: "Price inquiry pending",
        createdAt: "2024-12-17T13:20:00Z",
        updatedAt: "2024-12-17T13:20:00Z"
      },
      {
        Id: 6,
        guestId: 6,
        roomId: 201,
        checkIn: "2024-12-22",
        checkOut: "2024-12-26",
        status: "confirmed",
        totalAmount: 320.00,
        notes: "Holiday booking",
        createdAt: "2024-12-10T08:30:00Z",
        updatedAt: "2024-12-15T10:15:00Z"
      },
      {
        Id: 7,
        guestId: 7,
        roomId: 202,
        checkIn: "2024-12-23",
        checkOut: "2024-12-27",
        status: "pending",
        totalAmount: 280.00,
        notes: "Group booking - 1 of 3",
        createdAt: "2024-12-11T12:00:00Z",
        updatedAt: "2024-12-16T15:30:00Z"
      },
      {
        Id: 8,
        guestId: 8,
        roomId: 203,
        checkIn: "2024-12-23",
        checkOut: "2024-12-27",
        status: "pending",
        totalAmount: 280.00,
        notes: "Group booking - 2 of 3",
        createdAt: "2024-12-11T12:00:00Z",
        updatedAt: "2024-12-16T15:30:00Z"
      },
      {
        Id: 9,
        guestId: 9,
        roomId: 204,
        checkIn: "2024-12-23",
        checkOut: "2024-12-27",
        status: "confirmed",
        totalAmount: 280.00,
        notes: "Group booking - 3 of 3",
        createdAt: "2024-12-11T12:00:00Z",
        updatedAt: "2024-12-17T09:45:00Z"
      },
      {
        Id: 10,
        guestId: 10,
        roomId: 301,
        checkIn: "2024-12-28",
        checkOut: "2024-12-31",
        status: "confirmed",
        totalAmount: 450.00,
        notes: "New Year celebration",
        createdAt: "2024-12-13T11:15:00Z",
        updatedAt: "2024-12-13T11:15:00Z"
      },
      {
        Id: 11,
        guestId: 11,
        roomId: 302,
        checkIn: "2024-12-29",
        checkOut: "2025-01-02",
        status: "inquiry",
        totalAmount: 600.00,
        notes: "Availability check for New Year",
        createdAt: "2024-12-18T10:20:00Z",
        updatedAt: "2024-12-18T10:20:00Z"
      },
      {
        Id: 12,
        guestId: 12,
        roomId: 106,
        checkIn: "2024-12-24",
        checkOut: "2024-12-26",
        status: "confirmed",
        totalAmount: 150.00,
        notes: "Christmas stay",
        createdAt: "2024-12-08T14:45:00Z",
        updatedAt: "2024-12-16T12:30:00Z"
      },
      {
        Id: 13,
        guestId: 13,
        roomId: 107,
        checkIn: "2024-12-30",
        checkOut: "2025-01-03",
        status: "pending",
        totalAmount: 400.00,
        notes: "Extended New Year stay",
        createdAt: "2024-12-15T16:20:00Z",
        updatedAt: "2024-12-17T14:10:00Z"
      },
      {
        Id: 14,
        guestId: 14,
        roomId: 108,
        checkIn: "2025-01-05",
        checkOut: "2025-01-08",
        status: "inquiry",
        totalAmount: 225.00,
        notes: "Post-holiday booking inquiry",
        createdAt: "2024-12-18T09:30:00Z",
        updatedAt: "2024-12-18T09:30:00Z"
      },
      {
        Id: 15,
        guestId: 15,
        roomId: 205,
        checkIn: "2025-01-10",
        checkOut: "2025-01-15",
        status: "confirmed",
        totalAmount: 375.00,
        notes: "Winter business trip",
        createdAt: "2024-12-17T11:45:00Z",
        updatedAt: "2024-12-17T11:45:00Z"
      }
    ];
    this.nextId = Math.max(...this.mockData.map(b => b.Id)) + 1;
  }

  // Simulate API delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    try {
      return [...this.mockData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  }

  async getById(id) {
    await this.delay();
    try {
      const booking = this.mockData.find(b => b.Id === parseInt(id));
      if (!booking) {
        throw new Error("Booking not found");
      }
      return { ...booking };
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw new Error("Booking not found");
    }
  }

  async create(bookingData) {
    await this.delay();
    try {
      const newBooking = {
        Id: this.nextId++,
        guestId: parseInt(bookingData.guestId),
        roomId: parseInt(bookingData.roomId),
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        status: bookingData.status || "inquiry",
        totalAmount: parseFloat(bookingData.totalAmount) || 0,
        notes: bookingData.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.mockData.push(newBooking);
      return { ...newBooking };
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async update(id, bookingData) {
    await this.delay();
    try {
      const index = this.mockData.findIndex(b => b.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Booking not found");
      }

      const updatedBooking = {
        ...this.mockData[index],
        guestId: parseInt(bookingData.guestId) || this.mockData[index].guestId,
        roomId: parseInt(bookingData.roomId) || this.mockData[index].roomId,
        checkIn: bookingData.checkIn || this.mockData[index].checkIn,
        checkOut: bookingData.checkOut || this.mockData[index].checkOut,
        status: bookingData.status || this.mockData[index].status,
        totalAmount: parseFloat(bookingData.totalAmount) || this.mockData[index].totalAmount,
        notes: bookingData.notes !== undefined ? bookingData.notes : this.mockData[index].notes,
        updatedAt: new Date().toISOString()
      };

      this.mockData[index] = updatedBooking;
      return { ...updatedBooking };
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  async delete(id) {
    await this.delay();
    try {
      const index = this.mockData.findIndex(b => b.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Booking not found");
      }

      this.mockData.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }

  async getByStatus(status) {
    await this.delay();
    try {
      return this.mockData
        .filter(booking => booking.status === status)
        .map(booking => ({ ...booking }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error fetching bookings by status:", error);
      return [];
    }
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return this.mockData
        .filter(booking => {
          const checkIn = new Date(booking.checkIn);
          const checkOut = new Date(booking.checkOut);
          return (checkIn <= end && checkOut >= start);
        })
        .map(booking => ({ ...booking }))
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    } catch (error) {
      console.error("Error fetching bookings by date range:", error);
      return [];
    }
  }

  async getByGuestId(guestId) {
    await this.delay();
    try {
      return this.mockData
        .filter(booking => booking.guestId === parseInt(guestId))
        .map(booking => ({ ...booking }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error fetching bookings by guest:", error);
      return [];
    }
  }

  async getByRoomId(roomId) {
    await this.delay();
    try {
      return this.mockData
        .filter(booking => booking.roomId === parseInt(roomId))
        .map(booking => ({ ...booking }))
        .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    } catch (error) {
      console.error("Error fetching bookings by room:", error);
      return [];
    }
  }

  async updateStatus(id, status) {
    await this.delay();
    try {
      return await this.update(id, { status });
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }

  async checkAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
    await this.delay();
    try {
      const conflictingBookings = this.mockData.filter(booking => {
        if (excludeBookingId && booking.Id === parseInt(excludeBookingId)) {
          return false; // Exclude the booking being edited
        }
        
        if (booking.roomId !== parseInt(roomId)) {
          return false; // Different room
        }

        if (booking.status === 'cancelled') {
          return false; // Cancelled bookings don't conflict
        }

        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        const requestCheckIn = new Date(checkIn);
        const requestCheckOut = new Date(checkOut);

        // Check for date overlap
        return !(requestCheckOut <= bookingCheckIn || requestCheckIn >= bookingCheckOut);
      });

      return {
        available: conflictingBookings.length === 0,
        conflicts: conflictingBookings.map(b => ({ ...b }))
      };
    } catch (error) {
      console.error("Error checking availability:", error);
      return { available: false, conflicts: [] };
    }
  }

  async getBookingStats() {
    await this.delay();
    try {
      const now = new Date();
      const bookings = [...this.mockData];
      
      return {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        inquiries: bookings.filter(b => b.status === 'inquiry').length,
        thisMonth: bookings.filter(b => {
          const checkIn = new Date(b.checkIn);
          return checkIn.getMonth() === now.getMonth() && checkIn.getFullYear() === now.getFullYear();
        }).length,
        totalRevenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      };
    } catch (error) {
      console.error("Error getting booking stats:", error);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        inquiries: 0,
        thisMonth: 0,
        totalRevenue: 0
      };
    }
  }
}

// Create and export singleton instance
const bookingService = new BookingService();
export default bookingService;