import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import dashboardService from "@/services/api/dashboardService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadMetrics} />;
  }

  if (!metrics) return null;

  const metricCards = [
    {
      title: "Occupancy Rate",
      value: `${metrics.occupancyRate}%`,
      change: metrics.occupancyRate > 75 ? "+5%" : metrics.occupancyRate < 50 ? "-3%" : "±0%",
      trend: metrics.occupancyRate > 75 ? "up" : metrics.occupancyRate < 50 ? "down" : "neutral",
      icon: "TrendingUp",
      gradient: "blue",
      subtitle: `${metrics.occupiedRooms}/${metrics.totalRooms} rooms occupied`
    },
    {
      title: "Available Beds",
      value: metrics.availableBeds,
      change: `${metrics.totalRooms - metrics.occupiedRooms} rooms`,
      trend: "neutral",
      icon: "BedDouble",
      gradient: "green",
      subtitle: "Ready for check-in"
    },
    {
      title: "Check-ins Today",
      value: metrics.checkInsToday,
      change: "+2 vs yesterday",
      trend: "up",
      icon: "UserPlus",
      gradient: "amber",
      subtitle: "Guests arriving"
    },
    {
      title: "Check-outs Today",
      value: metrics.checkOutsToday,
      change: "±0 vs yesterday",
      trend: "neutral",
      icon: "UserMinus",
      gradient: "red",
      subtitle: "Guests departing"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, index) => (
        <MetricCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardMetrics;