import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Default settings structure
const defaultSettings = {
  hostelInfo: {
    name: 'Mountain View Hostel',
    address: '123 Adventure Street, Mountain View, CA 94041',
    phone: '+1 (555) 123-4567',
    email: 'info@mountainviewhostel.com',
    website: 'https://mountainviewhostel.com',
    description: 'A modern hostel offering comfortable accommodations for travelers and backpackers.'
  },
  systemPreferences: {
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false
  },
  staffManagement: {
    maxStaffAccounts: 10,
    passwordPolicy: 'Standard',
    sessionTimeout: 30,
    twoFactorAuth: false,
    auditLogging: true
  },
  integrationSettings: {
    bookingEngineEnabled: true,
    paymentGateway: 'Stripe',
    emailService: 'SendGrid',
    smsService: 'Twilio',
    analyticsTracking: true,
    apiRateLimit: 1000
  }
};

// Settings service using localStorage
class SettingsService {
  constructor() {
    this.storageKey = 'hostelHub_settings';
    this.initializeSettings();
  }

  initializeSettings() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify(defaultSettings));
    }
  }

  async getAll() {
    await delay(300);
    try {
      const settings = localStorage.getItem(this.storageKey);
      return settings ? JSON.parse(settings) : defaultSettings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
  }

  async getByCategory(category) {
    await delay(200);
    try {
      const allSettings = await this.getAll();
      return allSettings[category] || {};
    } catch (error) {
      console.error(`Error fetching ${category} settings:`, error);
      return {};
    }
  }

  async update(category, data) {
    await delay(400);
    try {
      const currentSettings = await this.getAll();
      const updatedSettings = {
        ...currentSettings,
        [category]: { ...currentSettings[category], ...data }
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      return { success: true, data: updatedSettings[category] };
    } catch (error) {
      console.error(`Error updating ${category} settings:`, error);
      throw new Error(`Failed to update ${category} settings`);
    }
  }

  async reset(category) {
    await delay(300);
    try {
      const currentSettings = await this.getAll();
      const resetSettings = {
        ...currentSettings,
        [category]: defaultSettings[category]
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(resetSettings));
      return { success: true, data: resetSettings[category] };
    } catch (error) {
      console.error(`Error resetting ${category} settings:`, error);
      throw new Error(`Failed to reset ${category} settings`);
    }
  }
}

const settingsService = new SettingsService();

export default settingsService;