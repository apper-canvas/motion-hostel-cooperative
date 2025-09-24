const paymentsMockData = [
  {
    Id: 1,
    Name: "Payment-001",
    amount_c: 150.00,
    payment_date_c: "2024-01-15T10:30:00Z",
    payment_method_c: "Credit Card",
    transaction_type_c: "Check-in Payment",
    notes_c: "Initial payment for 3 nights",
    guest_id_c: { Id: 1, Name: "John Smith" }
  },
  {
    Id: 2,
    Name: "Payment-002", 
    amount_c: 75.00,
    payment_date_c: "2024-01-16T14:20:00Z",
    payment_method_c: "Cash",
    transaction_type_c: "Security Deposit",
    notes_c: "Security deposit",
    guest_id_c: { Id: 2, Name: "Sarah Johnson" }
  },
  {
    Id: 3,
    Name: "Payment-003",
    amount_c: 200.00,
    payment_date_c: "2024-01-17T09:15:00Z", 
    payment_method_c: "Debit Card",
    transaction_type_c: "Check-in Payment",
    notes_c: "Full payment for 4 nights",
    guest_id_c: { Id: 3, Name: "Mike Wilson" }
  },
  {
    Id: 4,
    Name: "Payment-004",
    amount_c: 50.00,
    payment_date_c: "2024-01-18T16:45:00Z",
    payment_method_c: "Bank Transfer",
    transaction_type_c: "Other",
    notes_c: "Additional charges",
    guest_id_c: { Id: 4, Name: "Emily Davis" }
  },
  {
    Id: 5,
    Name: "Payment-005",
    amount_c: 120.00,
    payment_date_c: "2024-01-19T11:30:00Z",
    payment_method_c: "Credit Card",
    transaction_type_c: "Check-in Payment",
    notes_c: "Payment for extended stay",
    guest_id_c: { Id: 5, Name: "David Brown" }
  }
];

class PaymentService {
  constructor() {
    this.mockData = paymentsMockData;
    this.nextId = Math.max(...this.mockData.map(p => p.Id)) + 1;
    this.apperClient = null;
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

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    try {
      return [...this.mockData].sort((a, b) => new Date(b.payment_date_c) - new Date(a.payment_date_c));
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  }

  async getById(id) {
    await this.delay();
    try {
      const payment = this.mockData.find(p => p.Id === parseInt(id));
      return payment ? { ...payment } : null;
    } catch (error) {
      console.error("Error fetching payment:", error);
      return null;
    }
  }

  async getByGuestId(guestId) {
    await this.delay();
    try {
      return this.mockData
        .filter(p => p.guest_id_c?.Id === parseInt(guestId))
        .map(p => ({ ...p }))
        .sort((a, b) => new Date(b.payment_date_c) - new Date(a.payment_date_c));
    } catch (error) {
      console.error("Error fetching payments by guest:", error);
      return [];
    }
  }

  async create(paymentData) {
    await this.delay();
    try {
      const newPayment = {
        Id: this.nextId++,
        Name: `Payment-${String(this.nextId).padStart(3, '0')}`,
        amount_c: parseFloat(paymentData.amount_c) || 0,
        payment_date_c: paymentData.payment_date_c || new Date().toISOString(),
        payment_method_c: paymentData.payment_method_c || "Credit Card",
        transaction_type_c: paymentData.transaction_type_c || "Check-in Payment",
        notes_c: paymentData.notes_c || "",
        guest_id_c: paymentData.guest_id_c
      };

      this.mockData.push(newPayment);
      return { ...newPayment };
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async update(id, paymentData) {
    await this.delay();
    try {
      const index = this.mockData.findIndex(p => p.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Payment not found");
      }

      const updatedPayment = {
        ...this.mockData[index],
        amount_c: parseFloat(paymentData.amount_c) || this.mockData[index].amount_c,
        payment_date_c: paymentData.payment_date_c || this.mockData[index].payment_date_c,
        payment_method_c: paymentData.payment_method_c || this.mockData[index].payment_method_c,
        transaction_type_c: paymentData.transaction_type_c || this.mockData[index].transaction_type_c,
        notes_c: paymentData.notes_c !== undefined ? paymentData.notes_c : this.mockData[index].notes_c,
        guest_id_c: paymentData.guest_id_c || this.mockData[index].guest_id_c
      };

      this.mockData[index] = updatedPayment;
      return { ...updatedPayment };
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  }

  async delete(id) {
    await this.delay();
    try {
      const index = this.mockData.findIndex(p => p.Id === parseInt(id));
      if (index === -1) {
        throw new Error("Payment not found");
      }

      this.mockData.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;