import React from "react";
import { Routes, Route } from "react-router-dom";
import CompanyDashboard from "./pages/CompanyPages/CompanyDashboard";
import CompanyBookings from "./pages/CompanyPages/CompanyBookings";
import CompanySchedule from "./pages/CompanyPages/CompanySchedule";
import CompanyPayments from "./pages/CompanyPages/CompanyPayments";
import CompanyProfile from "./pages/CompanyPages/CompanyProfile";
import CompanyAccount from "./pages/CompanyPages/CompanyAccount";

export default function CompanyCompany() {
  return (
    <Routes>
      <Route path="/" element={<CompanyDashboard/>} />
      <Route path="bookings" element={<CompanyBookings />} />
      <Route path="schedule" element={<CompanySchedule />} />
      <Route path="payments" element={<CompanyPayments />} />
      <Route path="profile" element={<CompanyProfile />} />
      <Route path="account" element={<CompanyAccount />} />

    </Routes>
  );
}
