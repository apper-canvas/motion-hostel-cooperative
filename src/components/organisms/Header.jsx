import React from "react";
import ApperIcon from "@/components/ApperIcon";
import LogoutButton from "@/components/atoms/LogoutButton";
import { format } from "date-fns";
const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const currentTime = new Date();

  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={20} 
              className="text-gray-600" 
            />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              HostelHub
            </h1>
            <p className="text-sm text-gray-600">Hostel Management System</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{format(currentTime, "MMMM d, yyyy")}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span>{format(currentTime, "h:mm a")}</span>
          </div>
          
          <LogoutButton />
          
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;