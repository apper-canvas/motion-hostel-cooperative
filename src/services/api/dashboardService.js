import dashboardMetricsData from "@/services/mockData/dashboardMetrics.json";
import roomsData from "@/services/mockData/rooms.json";

class DashboardService {
  constructor() {
    this.baseMetrics = { ...dashboardMetricsData };
  }

  async getMetrics() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calculate real-time metrics from room data
    const rooms = [...roomsData];
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === "Occupied").length;
    const availableRooms = rooms.filter(room => room.status === "Available").length;
    const maintenanceRooms = rooms.filter(room => room.status === "Maintenance").length;
    const reservedRooms = rooms.filter(room => room.status === "Reserved").length;
    
    // Calculate available beds
    const availableBeds = rooms
      .filter(room => room.status === "Available")
      .reduce((total, room) => total + room.bedCount, 0);
    
    // Calculate occupancy rate
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    
    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      reservedRooms,
      availableBeds,
      occupancyRate,
      checkInsToday: this.baseMetrics.checkInsToday,
      checkOutsToday: this.baseMetrics.checkOutsToday,
      lastUpdated: new Date().toISOString()
    };
  }

  async getOccupancyTrend(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
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
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      todayRevenue: 4250,
      averageStay: 3.5,
      guestSatisfaction: 4.6,
      bookingRate: 85
    };
  }
}

export default new DashboardService();