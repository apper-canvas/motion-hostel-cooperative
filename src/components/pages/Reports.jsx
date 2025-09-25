import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import reportsService from "@/services/api/reportsService";
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';

const Reports = () => {
  // State management
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [reportData, setReportData] = useState({
    occupancy: null,
    revenue: null,
    guests: null,
    bookings: null,
    maintenance: null
  });
  
  const [loading, setLoading] = useState({
    occupancy: false,
    revenue: false,
    guests: false,
    bookings: false,
    maintenance: false,
    export: false
  });
  
  const [error, setError] = useState("");

  // Load all reports
  const loadReports = async () => {
    try {
      setLoading(prev => ({ ...prev, occupancy: true, revenue: true, guests: true, bookings: true, maintenance: true }));
      setError("");
      
      const [occupancy, revenue, guests, bookings, maintenance] = await Promise.all([
        reportsService.getOccupancyAnalytics(dateRange.startDate, dateRange.endDate),
        reportsService.getRevenueAnalytics(dateRange.startDate, dateRange.endDate),
        reportsService.getGuestAnalytics(dateRange.startDate, dateRange.endDate),
        reportsService.getBookingPatterns(dateRange.startDate, dateRange.endDate),
        reportsService.getMaintenanceReport(dateRange.startDate, dateRange.endDate)
      ]);
      
      setReportData({ occupancy, revenue, guests, bookings, maintenance });
      toast.success("Reports updated successfully");
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    } finally {
      setLoading(prev => ({ ...prev, occupancy: false, revenue: false, guests: false, bookings: false, maintenance: false }));
    }
  };

  // Export functionality
  const exportReport = async (format) => {
    try {
      setLoading(prev => ({ ...prev, export: true }));
      
      const comprehensiveData = await reportsService.getComprehensiveReport(dateRange.startDate, dateRange.endDate);
      
      if (format === 'pdf') {
        // Simulate PDF generation
        const blob = new Blob([JSON.stringify(comprehensiveData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hotel-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'excel') {
        // Simulate Excel export
        const csvContent = this.convertToCSV(comprehensiveData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hotel-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error("Error exporting report:", err);
      toast.error("Failed to export report");
    } finally {
      setLoading(prev => ({ ...prev, export: false }));
    }
  };

  // Load reports on mount and date change
  useEffect(() => {
    loadReports();
  }, [dateRange]);

  // Date range handlers
  const setQuickRange = (days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    setDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
  };

  const setMonthRange = (monthsBack = 0) => {
    const date = subDays(new Date(), monthsBack * 30);
    setDateRange({
      startDate: format(startOfMonth(date), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(date), 'yyyy-MM-dd')
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadReports} />
      </div>
    );
  }

  // Chart configurations
  const occupancyChartOptions = {
    chart: { type: 'area', height: 300, toolbar: { show: true } },
    colors: ['#3b82f6'],
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
    xaxis: { 
      categories: reportData.occupancy?.trend?.map(d => format(new Date(d.date), 'MMM dd')) || [],
      title: { text: 'Date' }
    },
    yaxis: { 
      title: { text: 'Occupancy Rate (%)' },
      min: 0,
      max: 100
    },
    title: { text: 'Occupancy Trend', align: 'center' },
    tooltip: { 
      y: { formatter: (val) => `${val}%` }
    }
  };

  const revenueChartOptions = {
    chart: { type: 'column', height: 300 },
    colors: ['#10b981'],
    xaxis: { 
      categories: reportData.revenue?.trend?.map(d => format(new Date(d.date), 'MMM dd')) || [],
      title: { text: 'Date' }
    },
    yaxis: { 
      title: { text: 'Revenue ($)' },
      labels: { formatter: (val) => `$${val}` }
    },
    title: { text: 'Daily Revenue', align: 'center' },
    tooltip: { 
      y: { formatter: (val) => `$${val}` }
    }
  };

  const bookingStatusOptions = {
    chart: { type: 'donut', height: 300 },
    labels: Object.keys(reportData.bookings?.statusDistribution || {}),
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    title: { text: 'Booking Status Distribution', align: 'center' },
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 200 }, legend: { position: 'bottom' } }
    }]
  };

  const maintenancePriorityOptions = {
    chart: { type: 'bar', height: 300 },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    xaxis: { categories: Object.keys(reportData.maintenance?.priorityDistribution || {}) },
    yaxis: { title: { text: 'Number of Issues' } },
    title: { text: 'Maintenance Issues by Priority', align: 'center' },
    plotOptions: { bar: { horizontal: false, columnWidth: '50%' } }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive insights and performance analytics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick date filters */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setQuickRange(7)}
            className={dateRange.startDate === format(subDays(new Date(), 7), 'yyyy-MM-dd') ? 'bg-primary text-white' : ''}
          >
            7 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setQuickRange(30)}
            className={dateRange.startDate === format(subDays(new Date(), 30), 'yyyy-MM-dd') ? 'bg-primary text-white' : ''}
          >
            30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMonthRange(0)}
          >
            This Month
          </Button>
          
          {/* Date inputs */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          
          {/* Export buttons */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportReport('pdf')}
            disabled={loading.export}
          >
            <ApperIcon name="FileText" size={16} className="mr-2" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => exportReport('excel')}
            disabled={loading.export}
          >
            <ApperIcon name="FileSpreadsheet" size={16} className="mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {loading.occupancy ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <MetricCard
            title="Avg Occupancy"
            value={`${reportData.occupancy?.averageOccupancy || 0}%`}
            change={`Peak: ${reportData.occupancy?.peakOccupancy || 0}%`}
            icon="TrendingUp"
            trend="up"
            gradient="blue"
          />
        )}
        
        {loading.revenue ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <MetricCard
            title="Total Revenue"
            value={`$${(reportData.revenue?.totalRevenue || 0).toLocaleString()}`}
            change={`Daily Avg: $${(reportData.revenue?.averageDaily || 0).toLocaleString()}`}
            icon="DollarSign"
            trend="up"
            gradient="green"
          />
        )}
        
        {loading.guests ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <MetricCard
            title="Total Guests"
            value={reportData.guests?.totalGuests || 0}
            change={`Repeat: ${reportData.guests?.repeatGuests || 0}`}
            icon="Users"
            trend="neutral"
            gradient="amber"
          />
        )}
        
        {loading.bookings ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <MetricCard
            title="Bookings"
            value={reportData.bookings?.totalBookings || 0}
            change={`Cancel Rate: ${(reportData.bookings?.cancellationRate || 0).toFixed(1)}%`}
            icon="Calendar"
            trend={reportData.bookings?.cancellationRate > 10 ? "down" : "neutral"}
            gradient="blue"
          />
        )}
        
        <MetricCard
          title="Satisfaction"
          value={`${reportData.guests?.satisfactionScore || 0}/5`}
          change="Guest Rating"
          icon="Star"
          trend="up"
          gradient="amber"
        />
        
        {loading.maintenance ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <MetricCard
            title="Maintenance"
            value={reportData.maintenance?.totalIssues || 0}
            change={`Critical: ${reportData.maintenance?.criticalIssues || 0}`}
            icon="Wrench"
            trend={reportData.maintenance?.criticalIssues > 5 ? "down" : "neutral"}
            gradient="red"
          />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupancy Trend */}
        <Card>
          <CardContent className="p-6">
            {loading.occupancy ? (
              <Loading />
            ) : (
              <Chart
                options={occupancyChartOptions}
                series={[{
                  name: 'Occupancy Rate',
                  data: reportData.occupancy?.trend?.map(d => d.occupancyRate) || []
                }]}
                type="area"
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardContent className="p-6">
            {loading.revenue ? (
              <Loading />
            ) : (
              <Chart
                options={revenueChartOptions}
                series={[{
                  name: 'Daily Revenue',
                  data: reportData.revenue?.trend?.map(d => d.revenue) || []
                }]}
                type="column"
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardContent className="p-6">
            {loading.bookings ? (
              <Loading />
            ) : (
              <Chart
                options={bookingStatusOptions}
                series={Object.values(reportData.bookings?.statusDistribution || {})}
                type="donut"
                height={300}
              />
            )}
          </CardContent>
        </Card>

        {/* Maintenance Issues */}
        <Card>
          <CardContent className="p-6">
            {loading.maintenance ? (
              <Loading />
            ) : (
              <Chart
                options={maintenancePriorityOptions}
                series={[{
                  name: 'Issues',
                  data: Object.values(reportData.maintenance?.priorityDistribution || {})
                }]}
                type="bar"
                height={300}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Guests */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Guests</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading.guests ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : (
                    (reportData.guests?.recentGuests || []).map((guest, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 font-medium">{guest.Name || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600">{guest.email_c || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {guest.check_in_date_c ? format(new Date(guest.check_in_date_c), 'MMM dd') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Maintenance Issues */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Maintenance</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Issue</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Priority</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading.maintenance ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : (
                    (reportData.maintenance?.recentIssues || []).map((issue, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="font-medium">{issue.issue_type_c || 'General'}</div>
                          <div className="text-gray-600 text-xs truncate max-w-xs">
                            {issue.description_c || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.priority_c === 'High' ? 'bg-red-100 text-red-800' :
                            issue.priority_c === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.priority_c || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.status_c === 'Resolved' ? 'bg-green-100 text-green-800' :
                            issue.status_c === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.status_c || 'Open'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Footer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Report Summary</h3>
              <p className="text-sm text-gray-600 mt-1">
                Data from {format(new Date(dateRange.startDate), 'MMM dd, yyyy')} to {format(new Date(dateRange.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Last updated: {format(new Date(), 'HH:mm')}</span>
              <Button variant="outline" size="sm" onClick={loadReports} disabled={Object.values(loading).some(l => l)}>
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;