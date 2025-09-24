import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Rooms from "@/components/pages/Rooms";
import Guests from "@/components/pages/Guests";
import Bookings from "@/components/pages/Bookings";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";
import Maintenance from "@/components/pages/Maintenance";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="guests" element={<Guests />} />
            <Route path="bookings" element={<Bookings />} />
<Route path="reports" element={<Reports />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;