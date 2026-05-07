import React from "react";
import { Routes, Route } from "react-router-dom";
import CleanerDashboad from "./pages/CleanerPages/CleanerDashboad";
import CleanerBookings from "./pages/CleanerPages/CleanerBookings";
import CleanerFeedback from "./pages/CleanerPages/CleanerFeedback";
import CleanerEarnings from "./pages/CleanerPages/CleanerEarnings";
import CleanerProfile from "./pages/CleanerPages/CleanerProfile";
export default function Cleaner() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CleanerDashboad />} />
        <Route path="bookings" element={<CleanerBookings />} />
        <Route path="reviews" element={<CleanerFeedback />} />
        <Route path="earnings" element={<CleanerEarnings />} />
        <Route path="profile" element={<CleanerProfile />} />
      </Routes>
    </div>
  );
}
