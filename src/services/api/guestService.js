class GuestService {
  constructor() {
    this.tableName = 'guest_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching guests:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Guest not found");
      } else {
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error?.response?.data?.message || error);
      throw new Error("Guest not found");
    }
  }

  async create(guestData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const params = {
        records: [{
Name: guestData.name_c || guestData.Name || "",
          name_c: guestData.name_c || guestData.name || "",
          email_c: guestData.email_c || guestData.email || "",
          check_in_c: guestData.check_in_c || guestData.checkIn || "",
          check_out_c: guestData.check_out_c || guestData.checkOut || "",
          room_id_c: parseInt(guestData.room_id_c || guestData.roomId) || null,
          status_c: guestData.status_c || guestData.status || "reserved",
          nationality_c: guestData.nationality_c || guestData.nationality || "",
          phone_c: guestData.phone_c || guestData.phone || "",
          id_document_c: guestData.id_document_c || guestData.idDocument || "",
          Tags: guestData.Tags || guestData.tags || ""
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
          console.error(`Failed to create ${failed.length} guest records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating guest:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, guestData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
Id: parseInt(id),
          Name: guestData.name_c || guestData.Name || "",
          name_c: guestData.name_c || guestData.name || "",
          email_c: guestData.email_c || guestData.email || "",
          check_in_c: guestData.check_in_c || guestData.checkIn || "",
          check_out_c: guestData.check_out_c || guestData.checkOut || "",
          room_id_c: parseInt(guestData.room_id_c || guestData.roomId) || null,
          status_c: guestData.status_c || guestData.status || "",
          nationality_c: guestData.nationality_c || guestData.nationality || "",
          phone_c: guestData.phone_c || guestData.phone || "",
          id_document_c: guestData.id_document_c || guestData.idDocument || "",
          Tags: guestData.Tags || guestData.tags || ""
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
          console.error(`Failed to update ${failed.length} guest records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating guest:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} guest records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting guest:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
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
      console.error("Error fetching guests by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async checkIn(id) {
    return this.updateStatus(id, "checked-in");
  }

  async checkOut(id) {
    return this.updateStatus(id, "checked-out");
  }

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
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
      console.error("Error updating guest status:", error?.response?.data?.message || error);
      throw error;
}
  }

  // Booking-related methods
  async getByDateRange(startDate, endDate) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const start = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
      const end = endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate;
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "check_in_c", "Operator": "LessThanOrEqualTo", "Values": [end]},
          {"FieldName": "check_out_c", "Operator": "GreaterThanOrEqualTo", "Values": [start]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching guests by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getActiveBookings() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "check_in_c", "Operator": "LessThanOrEqualTo", "Values": [today]},
          {"FieldName": "check_out_c", "Operator": "GreaterThan", "Values": [today]},
          {"FieldName": "status_c", "Operator": "ExactMatch", "Values": ["checked-in", "confirmed"]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching active bookings:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getUpcomingCheckIns(days = 7) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const today = new Date();
      const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "nationality_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "id_document_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "check_in_c", "Operator": "GreaterThanOrEqualTo", "Values": [today.toISOString().split('T')[0]]},
          {"FieldName": "check_in_c", "Operator": "LessThanOrEqualTo", "Values": [futureDate.toISOString().split('T')[0]]},
          {"FieldName": "status_c", "Operator": "ExactMatch", "Values": ["confirmed", "reserved"]}
        ],
        orderBy: [{"fieldName": "check_in_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching upcoming check-ins:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new GuestService();