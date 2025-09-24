import maintenanceData from '@/services/mockData/maintenance.json';

class MaintenanceService {
  constructor() {
    this.maintenance = [...maintenanceData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.maintenance];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const maintenance = this.maintenance.find(m => m.Id === parseInt(id));
    if (!maintenance) {
      throw new Error("Maintenance request not found");
    }
    return { ...maintenance };
  }

  async getByRoomId(roomId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.maintenance.filter(m => m.roomId === parseInt(roomId)).map(m => ({ ...m }));
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.maintenance.filter(m => m.status === status).map(m => ({ ...m }));
  }

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.maintenance.filter(m => m.priority === priority).map(m => ({ ...m }));
  }

  async create(maintenanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.maintenance.map(m => m.Id)) + 1;
    const newMaintenance = {
      Id: newId,
      ...maintenanceData,
      reportedDate: new Date().toISOString(),
      status: maintenanceData.status || "Pending"
    };
    this.maintenance.push(newMaintenance);
    return { ...newMaintenance };
  }

  async update(id, maintenanceData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.maintenance.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Maintenance request not found");
    }
    this.maintenance[index] = {
      ...this.maintenance[index],
      ...maintenanceData,
      Id: parseInt(id)
    };
    return { ...this.maintenance[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.maintenance.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Maintenance request not found");
    }
    const deleted = this.maintenance.splice(index, 1)[0];
    return { ...deleted };
  }

  async updateStatus(id, status, completedDate = null) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.maintenance.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Maintenance request not found");
    }
    this.maintenance[index].status = status;
    if (status === "Completed" && !this.maintenance[index].completedDate) {
      this.maintenance[index].completedDate = completedDate || new Date().toISOString();
    }
    return { ...this.maintenance[index] };
  }

  async getStatistics() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stats = this.maintenance.reduce((acc, item) => {
      acc.total += 1;
      acc.byStatus[item.status] = (acc.byStatus[item.status] || 0) + 1;
      acc.byPriority[item.priority] = (acc.byPriority[item.priority] || 0) + 1;
      acc.byCategory[item.category] = (acc.byCategory[item.category] || 0) + 1;
      
      if (item.actualCost) {
        acc.totalCost += item.actualCost;
      }
      if (item.estimatedCost) {
        acc.estimatedCost += item.estimatedCost;
      }
      
      return acc;
    }, {
      total: 0,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      totalCost: 0,
      estimatedCost: 0
    });
    
    return stats;
  }
}

export default new MaintenanceService();