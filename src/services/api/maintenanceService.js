class MaintenanceService {
  constructor() {
    this.tableName = 'maintenance_c';
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
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "reported_by_c"}},
          {"field": {"Name": "reported_date_c"}},
          {"field": {"Name": "scheduled_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "estimated_cost_c"}},
          {"field": {"Name": "actual_cost_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "reported_by_c"}},
          {"field": {"Name": "reported_date_c"}},
          {"field": {"Name": "scheduled_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "estimated_cost_c"}},
          {"field": {"Name": "actual_cost_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Maintenance request not found");
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching maintenance ${id}:`, error?.response?.data?.message || error);
      throw new Error("Maintenance request not found");
    }
  }

  async getByRoomId(roomId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "reported_by_c"}},
          {"field": {"Name": "reported_date_c"}},
          {"field": {"Name": "scheduled_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "estimated_cost_c"}},
          {"field": {"Name": "actual_cost_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{"FieldName": "room_id_c", "Operator": "EqualTo", "Values": [parseInt(roomId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching maintenance by room:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "reported_by_c"}},
          {"field": {"Name": "reported_date_c"}},
          {"field": {"Name": "scheduled_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "estimated_cost_c"}},
          {"field": {"Name": "actual_cost_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching maintenance by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assigned_staff_c"}},
          {"field": {"Name": "reported_by_c"}},
          {"field": {"Name": "reported_date_c"}},
          {"field": {"Name": "scheduled_date_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "estimated_cost_c"}},
          {"field": {"Name": "actual_cost_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching maintenance by priority:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(maintenanceData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: maintenanceData.title_c || maintenanceData.title || "",
          room_id_c: parseInt(maintenanceData.room_id_c || maintenanceData.roomId) || null,
          room_number_c: maintenanceData.room_number_c || maintenanceData.roomNumber || "",
          title_c: maintenanceData.title_c || maintenanceData.title || "",
          description_c: maintenanceData.description_c || maintenanceData.description || "",
          priority_c: maintenanceData.priority_c || maintenanceData.priority || "Medium",
          status_c: maintenanceData.status_c || maintenanceData.status || "Pending",
          assigned_staff_c: maintenanceData.assigned_staff_c || maintenanceData.assignedStaff || "",
          reported_by_c: maintenanceData.reported_by_c || maintenanceData.reportedBy || "",
          reported_date_c: maintenanceData.reported_date_c || new Date().toISOString(),
          scheduled_date_c: maintenanceData.scheduled_date_c || maintenanceData.scheduledDate || null,
          completed_date_c: maintenanceData.completed_date_c || maintenanceData.completedDate || null,
          estimated_cost_c: parseFloat(maintenanceData.estimated_cost_c || maintenanceData.estimatedCost) || 0,
          actual_cost_c: parseFloat(maintenanceData.actual_cost_c || maintenanceData.actualCost) || null,
          notes_c: maintenanceData.notes_c || maintenanceData.notes || "",
          category_c: maintenanceData.category_c || maintenanceData.category || "General"
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
          console.error(`Failed to create ${failed.length} maintenance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating maintenance:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, maintenanceData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: maintenanceData.title_c || maintenanceData.title || "",
          room_id_c: parseInt(maintenanceData.room_id_c || maintenanceData.roomId) || null,
          room_number_c: maintenanceData.room_number_c || maintenanceData.roomNumber || "",
          title_c: maintenanceData.title_c || maintenanceData.title || "",
          description_c: maintenanceData.description_c || maintenanceData.description || "",
          priority_c: maintenanceData.priority_c || maintenanceData.priority || "",
          status_c: maintenanceData.status_c || maintenanceData.status || "",
          assigned_staff_c: maintenanceData.assigned_staff_c || maintenanceData.assignedStaff || "",
          reported_by_c: maintenanceData.reported_by_c || maintenanceData.reportedBy || "",
          reported_date_c: maintenanceData.reported_date_c || maintenanceData.reportedDate || null,
          scheduled_date_c: maintenanceData.scheduled_date_c || maintenanceData.scheduledDate || null,
          completed_date_c: maintenanceData.completed_date_c || maintenanceData.completedDate || null,
          estimated_cost_c: parseFloat(maintenanceData.estimated_cost_c || maintenanceData.estimatedCost) || 0,
          actual_cost_c: parseFloat(maintenanceData.actual_cost_c || maintenanceData.actualCost) || null,
          notes_c: maintenanceData.notes_c || maintenanceData.notes || "",
          category_c: maintenanceData.category_c || maintenanceData.category || ""
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
          console.error(`Failed to update ${failed.length} maintenance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating maintenance:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} maintenance records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateStatus(id, status, completedDate = null) {
    try {
      const updateData = {
        status_c: status
      };
      
      if (status === "Completed" && !completedDate) {
        updateData.completed_date_c = new Date().toISOString();
      } else if (completedDate) {
        updateData.completed_date_c = completedDate;
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
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
    } catch (error) {
      console.error("Error updating maintenance status:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const data = await this.getAll();
      
      const stats = data.reduce((acc, item) => {
        acc.total += 1;
        acc.byStatus[item.status_c] = (acc.byStatus[item.status_c] || 0) + 1;
        acc.byPriority[item.priority_c] = (acc.byPriority[item.priority_c] || 0) + 1;
        acc.byCategory[item.category_c] = (acc.byCategory[item.category_c] || 0) + 1;
        
        if (item.actual_cost_c) {
          acc.totalCost += item.actual_cost_c;
        }
        if (item.estimated_cost_c) {
          acc.estimatedCost += item.estimated_cost_c;
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
    } catch (error) {
      console.error("Error getting maintenance statistics:", error?.response?.data?.message || error);
      return {
        total: 0,
        byStatus: {},
        byPriority: {},
        byCategory: {},
        totalCost: 0,
        estimatedCost: 0
      };
    }
  }
}

export default new MaintenanceService();