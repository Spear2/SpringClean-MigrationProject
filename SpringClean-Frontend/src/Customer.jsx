import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerBookingPage from "./pages/CustomerPages/CustomerBookingPage";
import CustomerBookingSummary from "./pages/CustomerPages/CustomerBookingSummary";
import CustomerHomePage from "./pages/CustomerPages/CustomerHomePage";
import CustomerPaymentPage from "./pages/CustomerPages/CustomerPaymentPage";
import CustomerProfilePage from "./pages/CustomerPages/CustomerProfilePage";
import CustomerSettingsPage from "./pages/CustomerPages/CustomerSettingsPage";
import CustomerWallet from "./pages/CustomerPages/CustomerWallet";
import CustomerReviews from "./pages/CustomerPages/CustomerReviews";
import CustomerFeedback from "./pages/CustomerPages/CustomerFeedback";
export default function Customer() {
  return (
    <Routes>
      <Route path="/" element={<CustomerHomePage />} />
      <Route path="booking" element={<CustomerBookingPage />} />
      <Route path="bookingSummary" element={<CustomerBookingSummary />} />
      <Route path="payments" element={<CustomerPaymentPage />} />
      <Route path="profile" element={<CustomerProfilePage />} />
      <Route path="settings" element={<CustomerSettingsPage />} />
      <Route path="wallet" element={<CustomerWallet />} />
      <Route path="reviews" element={<CustomerReviews />} />
      <Route path="preview" element={<CustomerFeedback />} />
    </Routes>
  );
}
