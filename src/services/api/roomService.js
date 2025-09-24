class RoomService {
  constructor() {
    this.tableName = 'room_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "bed_count_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "bathroom_type_c"}},
          {"field": {"Name": "window_view_c"}},
          {"field": {"Name": "base_rate_per_bed_c"}},
          {"field": {"Name": "private_room_rate_c"}},
          {"field": {"Name": "seasonal_adjustment_c"}},
          {"field": {"Name": "current_occupants_c"}},
          {"field": {"Name": "max_occupancy_c"}},
          {"field": {"Name": "last_updated_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (response?.data?.length > 0) {
        return response.data.map(room => this.transformRoomData(room));
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  }

async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "bed_count_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "bathroom_type_c"}},
          {"field": {"Name": "window_view_c"}},
          {"field": {"Name": "base_rate_per_bed_c"}},
          {"field": {"Name": "private_room_rate_c"}},
          {"field": {"Name": "seasonal_adjustment_c"}},
          {"field": {"Name": "current_occupants_c"}},
          {"field": {"Name": "max_occupancy_c"}},
          {"field": {"Name": "last_updated_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (response?.data) {
        return this.transformRoomData(response.data);
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      return null;
    }
  }

  async create(roomData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: roomData.number_c || roomData.number || "",
          number_c: roomData.number_c || roomData.number || "",
          type_c: roomData.type_c || roomData.type || "4-Bed Dorm",
          bed_count_c: parseInt(roomData.bed_count_c || roomData.bedCount) || 4,
          status_c: roomData.status_c || roomData.status || "Available",
          amenities_c: roomData.amenities_c || (Array.isArray(roomData.amenities) ? roomData.amenities.join(", ") : roomData.amenities) || "",
          bathroom_type_c: roomData.bathroom_type_c || roomData.bathroomType || "Shared",
          window_view_c: roomData.window_view_c || roomData.windowView || "Interior",
          base_rate_per_bed_c: parseFloat(roomData.base_rate_per_bed_c || roomData.baseRatePerBed) || 25.00,
          private_room_rate_c: parseFloat(roomData.private_room_rate_c || roomData.privateRoomRate) || 80.00,
          seasonal_adjustment_c: parseInt(roomData.seasonal_adjustment_c || roomData.seasonalAdjustment) || 0,
          current_occupants_c: parseInt(roomData.current_occupants_c || roomData.currentOccupants) || 0,
          max_occupancy_c: parseInt(roomData.max_occupancy_c || roomData.maxOccupancy) || 4,
          last_updated_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} room records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating room:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, roomData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: roomData.number_c || roomData.number || "",
          number_c: roomData.number_c || roomData.number || "",
          type_c: roomData.type_c || roomData.type || "",
          bed_count_c: parseInt(roomData.bed_count_c || roomData.bedCount) || 0,
          status_c: roomData.status_c || roomData.status || "",
          amenities_c: roomData.amenities_c || (Array.isArray(roomData.amenities) ? roomData.amenities.join(", ") : roomData.amenities) || "",
          bathroom_type_c: roomData.bathroom_type_c || roomData.bathroomType || "",
          window_view_c: roomData.window_view_c || roomData.windowView || "",
          base_rate_per_bed_c: parseFloat(roomData.base_rate_per_bed_c || roomData.baseRatePerBed) || 0,
          private_room_rate_c: parseFloat(roomData.private_room_rate_c || roomData.privateRoomRate) || 0,
          seasonal_adjustment_c: parseInt(roomData.seasonal_adjustment_c || roomData.seasonalAdjustment) || 0,
          current_occupants_c: parseInt(roomData.current_occupants_c || roomData.currentOccupants) || 0,
          max_occupancy_c: parseInt(roomData.max_occupancy_c || roomData.maxOccupancy) || 0,
          last_updated_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} room records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating room:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} room records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting room:", error?.response?.data?.message || error);
      throw error;
    }
  }

async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "bed_count_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "bathroom_type_c"}},
          {"field": {"Name": "window_view_c"}},
          {"field": {"Name": "base_rate_per_bed_c"}},
          {"field": {"Name": "private_room_rate_c"}},
          {"field": {"Name": "seasonal_adjustment_c"}},
          {"field": {"Name": "current_occupants_c"}},
          {"field": {"Name": "max_occupancy_c"}},
          {"field": {"Name": "last_updated_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (response?.data?.length > 0) {
        return response.data.map(room => this.transformRoomData(room));
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching rooms by status:", error);
      return [];
    }
  }

async updateStatus(id, status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status,
          last_updated_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful[0]?.data;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating room status:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Transform database fields (_c suffix) to UI-expected camelCase properties

  // Transform database fields (_c suffix) to UI-expected camelCase properties
  transformRoomData(room) {
    if (!room) return null;
    
    return {
      ...room,
      // Core room properties
      number: room.number_c || room.number || "",
      type: room.type_c || room.type || "",
      status: room.status_c || room.status || "",
      bedCount: room.bed_count_c || room.bedCount || 0,
      currentOccupants: room.current_occupants_c || room.currentOccupants || 0,
      maxOccupancy: room.max_occupancy_c || room.maxOccupancy || 0,
      
      // Amenities handling (convert string to array if needed)
      amenities: room.amenities_c ? 
        (typeof room.amenities_c === 'string' ? 
          room.amenities_c.split(',').map(a => a.trim()).filter(Boolean) : 
          room.amenities_c
        ) : 
        (room.amenities || []),
      
      // Room details  
      bathroomType: room.bathroom_type_c || room.bathroomType || "",
      windowView: room.window_view_c || room.windowView || "",
      lastUpdated: room.last_updated_c || room.lastUpdated || new Date().toISOString(),
      
// Pricing object structure
      pricing: {
        baseRatePerBed: room.base_rate_per_bed_c || room.pricing?.baseRatePerBed || 0,
        privateRoomRate: room.private_room_rate_c || room.pricing?.privateRoomRate || 0,
        seasonalAdjustment: room.seasonal_adjustment_c || room.pricing?.seasonalAdjustment || 0
      }
    };
}

  // Booking-related methods
  async getAvailableRooms(checkIn, checkOut) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // First get all rooms
      const allRooms = await this.getAll();
      
      // For mock implementation, assume all rooms are available
      // In real implementation, this would cross-reference with booking data
      return allRooms.filter(room => room.status === 'Available');
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      return [];
    }
  }
  async checkRoomAvailability(roomId, checkIn, checkOut, excludeBookingId = null) {
    try {
      // Mock implementation - in real scenario would check against booking records
      const room = await this.getById(roomId);
      if (!room) {
        return { available: false, reason: "Room not found" };
      }
      
      if (room.status !== 'Available') {
        return { available: false, reason: "Room not available" };
      }
      
      return { available: true };
    } catch (error) {
      console.error("Error checking room availability:", error);
      return { available: false, reason: "Error checking availability" };
    }
  }

  async getRoomOccupancy() {
    try {
      const rooms = await this.getAll();
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(room => 
        room.status === 'Occupied' || 
        (room.currentOccupants > 0)
      ).length;
      
      return {
        total: totalRooms,
        occupied: occupiedRooms,
        available: totalRooms - occupiedRooms,
        occupancyRate: totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(1) : 0
      };
    } catch (error) {
      console.error("Error calculating room occupancy:", error);
      return {
        total: 0,
        occupied: 0,
        available: 0,
        occupancyRate: 0
      };
    }
  }

  async updateOccupancy(roomId, occupantCount) {
    try {
      return await this.update(roomId, {
        current_occupants_c: parseInt(occupantCount) || 0,
        status_c: occupantCount > 0 ? 'Occupied' : 'Available'
      });
    } catch (error) {
      console.error("Error updating room occupancy:", error);
      throw error;
    }
  }

}

// Create and export singleton instance
const roomService = new RoomService();
export default roomService;