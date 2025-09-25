import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import settingsService from "@/services/api/settingsService";
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('hostelInfo');
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tabs = [
    {
      id: 'hostelInfo',
      label: 'Hostel Information',
      icon: 'Building',
      description: 'Basic hostel details and contact information'
    },
    {
      id: 'systemPreferences',
      label: 'System Preferences',
      icon: 'Settings',
      description: 'System-wide preferences and defaults'
    },
    {
      id: 'staffManagement',
      label: 'Staff Management',
      icon: 'Users',
      description: 'User accounts and access control'
    },
    {
      id: 'integrationSettings',
      label: 'Integration Settings',
      icon: 'Link',
      description: 'Third-party integrations and API settings'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings[activeTab]) {
      setFormData({ ...settings[activeTab] });
    }
  }, [activeTab, settings]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await settingsService.update(activeTab, formData);
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          [activeTab]: result.data
        }));
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset these settings to default values?')) {
      setSaving(true);
      try {
        const result = await settingsService.reset(activeTab);
        if (result.success) {
          setSettings(prev => ({
            ...prev,
            [activeTab]: result.data
          }));
          setFormData({ ...result.data });
          toast.success('Settings reset to defaults');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error('Failed to reset settings');
      } finally {
        setSaving(false);
      }
    }
  };

  const renderHostelInfoForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <input
          type="url"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
    </div>
  );

  const renderSystemPreferencesForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.currency || 'USD'}
            onChange={(e) => handleInputChange('currency', e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.timezone || 'America/Los_Angeles'}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          >
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.checkInTime || '15:00'}
            onChange={(e) => handleInputChange('checkInTime', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.checkOutTime || '11:00'}
            onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoBackup"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.autoBackup || false}
            onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
          />
          <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
            Enable automatic daily backups
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.emailNotifications || false}
            onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
          />
          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
            Send email notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsNotifications"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.smsNotifications || false}
            onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
          />
          <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
            Send SMS notifications
          </label>
        </div>
      </div>
    </div>
  );

  const renderStaffManagementForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Staff Accounts</label>
        <input
          type="number"
          min="1"
          max="50"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.maxStaffAccounts || 10}
          onChange={(e) => handleInputChange('maxStaffAccounts', parseInt(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.passwordPolicy || 'Standard'}
          onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
        >
          <option value="Basic">Basic - Minimum 6 characters</option>
          <option value="Standard">Standard - 8+ chars, mixed case</option>
          <option value="Strong">Strong - 12+ chars, symbols required</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <input
          type="number"
          min="5"
          max="480"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.sessionTimeout || 30}
          onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorAuth"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.twoFactorAuth || false}
            onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
          />
          <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
            Require two-factor authentication
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auditLogging"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.auditLogging || false}
            onChange={(e) => handleInputChange('auditLogging', e.target.checked)}
          />
          <label htmlFor="auditLogging" className="ml-2 block text-sm text-gray-700">
            Enable audit logging
          </label>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettingsForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.paymentGateway || 'Stripe'}
          onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
        >
          <option value="Stripe">Stripe</option>
          <option value="PayPal">PayPal</option>
          <option value="Square">Square</option>
          <option value="Authorize.Net">Authorize.Net</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Service</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.emailService || 'SendGrid'}
            onChange={(e) => handleInputChange('emailService', e.target.value)}
          >
            <option value="SendGrid">SendGrid</option>
            <option value="Mailgun">Mailgun</option>
            <option value="AWS SES">AWS SES</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMS Service</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.smsService || 'Twilio'}
            onChange={(e) => handleInputChange('smsService', e.target.value)}
          >
            <option value="Twilio">Twilio</option>
            <option value="AWS SNS">AWS SNS</option>
            <option value="MessageBird">MessageBird</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (requests/hour)</label>
        <input
          type="number"
          min="100"
          max="10000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData.apiRateLimit || 1000}
          onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="bookingEngineEnabled"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.bookingEngineEnabled || false}
            onChange={(e) => handleInputChange('bookingEngineEnabled', e.target.checked)}
          />
          <label htmlFor="bookingEngineEnabled" className="ml-2 block text-sm text-gray-700">
            Enable online booking engine
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="analyticsTracking"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.analyticsTracking || false}
            onChange={(e) => handleInputChange('analyticsTracking', e.target.checked)}
          />
          <label htmlFor="analyticsTracking" className="ml-2 block text-sm text-gray-700">
            Enable analytics tracking
          </label>
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (activeTab) {
      case 'hostelInfo':
        return renderHostelInfoForm();
      case 'systemPreferences':
        return renderSystemPreferencesForm();
      case 'staffManagement':
        return renderStaffManagementForm();
      case 'integrationSettings':
        return renderIntegrationSettingsForm();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure hostel settings and system preferences</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <ApperIcon 
                  name={tabs.find(t => t.id === activeTab)?.icon || 'Settings'} 
                  size={24} 
                  className="text-white" 
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600">
                  {tabs.find(t => t.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-8">
              {renderFormContent()}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="RotateCcw" size={16} />
                <span>Reset to Defaults</span>
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ApperIcon name="Save" size={16} />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;