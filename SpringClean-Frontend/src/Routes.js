import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/Register/RegisterPage";
import CleanerLoginPage from "./pages/CleanerLoginPage/CleanerLoginPage";
import CustomerLoginPage from "./pages/CustomerLoginPage/CustomerLoginPage";
import ChooseYourRole from "./pages/ChooseYourRole/ChooseYourRole";
import CompanyCleaner from "./CompanyCleaner";
import Customer from "./Customer";
import Cleaner from "./Cleaner";
import CompanyLoginPage from "./pages/CompanyLoginPage/CompanyLoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Register" element={<RegisterPage />} />
      <Route path="/login/cleaner" element={<CleanerLoginPage />} />
      <Route path="/login/Customer" element={<CustomerLoginPage />} />
      <Route path="/login/company" element={<CompanyLoginPage />} />
      <Route path="/login/ChooseYourRole" element={<ChooseYourRole />} />

      {/* company protected routes */}
      <Route
        path="/company/*"
        element={
          <ProtectedRoute requiredType="company">
            <CompanyCleaner />
          </ProtectedRoute>
        }
      />

      {/* Customer protected routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredType="customer">
            <Customer />
          </ProtectedRoute>
        }
      />

      {/* Customer protected routes */}
      <Route
        path="/cleaner/*"
        element={
          <ProtectedRoute requiredType="cleaner">
            <Cleaner />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
