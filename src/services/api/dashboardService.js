class DashboardService {
  constructor() {
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

  async getMetrics() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Fetch room data from database
      const params = {
        fields: [
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bed_count_c"}},
          {"field": {"Name": "current_occupants_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('room_c', params);
      
      let rooms = [];
      if (response?.data?.length) {
        rooms = response.data;
      }
      
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(room => room.status_c === "Occupied").length;
      const availableRooms = rooms.filter(room => room.status_c === "Available").length;
      const maintenanceRooms = rooms.filter(room => room.status_c === "Maintenance").length;
      const reservedRooms = rooms.filter(room => room.status_c === "Reserved").length;
      
      // Calculate available beds
      const availableBeds = rooms
        .filter(room => room.status_c === "Available")
        .reduce((total, room) => total + (room.bed_count_c || 0), 0);
      
      // Calculate occupancy rate
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      
      return {
        totalRooms,
        occupiedRooms,
        availableRooms,
        maintenanceRooms,
        reservedRooms,
        availableBeds,
        occupancyRate,
        checkInsToday: 8, // Sample data for now
        checkOutsToday: 5, // Sample data for now
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error?.response?.data?.message || error);
      
      // Fallback metrics if database fails
      return {
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        maintenanceRooms: 0,
        reservedRooms: 0,
        availableBeds: 0,
        occupancyRate: 0,
        checkInsToday: 0,
        checkOutsToday: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  async getOccupancyTrend(days = 7) {
    // Generate sample trend data
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trend.push({
        date: date.toISOString().split("T")[0],
        occupancyRate: Math.floor(Math.random() * 30) + 60, // 60-90% range
        totalGuests: Math.floor(Math.random() * 20) + 30,
        revenue: Math.floor(Math.random() * 2000) + 3000
      });
    }
    
    return trend;
  }

  async getQuickStats() {
    return {
      todayRevenue: 4250,
      averageStay: 3.5,
      guestSatisfaction: 4.6,
      bookingRate: 85
    };
  }
}

export default new DashboardService();