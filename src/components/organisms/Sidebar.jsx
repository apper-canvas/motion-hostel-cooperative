import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/rooms", label: "Rooms", icon: "BedDouble" },
    { path: "/guests", label: "Guests", icon: "Users" },
    { path: "/bookings", label: "Bookings", icon: "Calendar" },
    { path: "/reports", label: "Reports", icon: "BarChart3" },
{ path: "/maintenance", label: "Maintenance", icon: "Wrench" },
    { path: "/settings", label: "Settings", icon: "Settings" }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
            <ApperIcon name="Building2" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">HostelHub</h2>
            <p className="text-xs text-gray-600">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border-l-4 border-l-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Staff Member</p>
            <p className="text-xs text-gray-600">Reception Desk</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-slate-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;