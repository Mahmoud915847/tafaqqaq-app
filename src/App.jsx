import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Client Pages
import Home from './Pages/Cliente/Home';
import Companies from './Pages/Cliente/Companies';
import CompanyDetails from './Pages/Cliente/CompanyDetails';
import CompareCompanies from './Pages/Cliente/CompareCompanies';
import BookInspection from './Pages/Cliente/BookInspection';
import MyBookings from './Pages/Cliente/MyBookings';
import BookingDetails from './Pages/Cliente/BookingDetails';
import Payment from './Pages/Cliente/Payment';
import InspectionReport from './Pages/Cliente/InspectionReport';
import Register from './Pages/Cliente/Register';

// Auth & Setup Pages
import Login from './Pages/login/Login';
import SetPassword from './Pages/login/SetPassword';
import ForgotPassword from './Pages/login/ForgotPassword';
import ForgotPasswordSent from './Pages/login/ForgotPasswordSent';
import ResetPassword from './Pages/login/ResetPassword';
import ResetLinkInvalid from './Pages/login/ResetLinkInvalid';
import VerifyOtp from './Pages/Cliente/VerifyOtp';

// Company Portal Pages
import RegisterCompany from './Pages/company/RegisterCompany';
import RequestSubmitted from './Pages/company/RequestSubmitted';
import CompanyDashboard from './Pages/company/CompanyDashboard';
import CompanyOrders from './Pages/company/CompanyOrders';
import OfficeInfo from './Pages/company/OfficeInfo';
import OfficePrices from './Pages/company/OfficePrices';
import OfficeSchedule from './Pages/company/OfficeSchedule';
import OfficeEngineers from './Pages/company/OfficeEngineers';
import OfficeLayout from './components/OfficeLayout';
import AdminLayout from './components/AdminLayout';
import EngineerLayout from './components/EngineerLayout';
import AdminAuditLogPage from './Pages/admin/AdminAuditLogPage';
import EngineerProfile from './Pages/engineer/EngineerProfile';
import AddEngineer from './Pages/company/AddEngineer';

// Engineer Portal Pages
import EngineerInspections from './Pages/engineer/EngineerInspections';
import WriteReport from './Pages/engineer/WriteReport';

// Admin Portal Pages
import AdminRequests from './Pages/admin/AdminRequests';
import AdminRequestDetails from './Pages/admin/AdminRequestDetails';
import AdminOffices from './Pages/admin/AdminOffices';
import RequireRole from './components/RequireRole';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/company/:id" element={<CompanyDetails />} />
        <Route path="/compare" element={<CompareCompanies />} />

        {/* Client Booking & Inspection Pages */}
        <Route element={<RequireRole roles={['Client']} />}>
          <Route path="/book-inspection" element={<BookInspection />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/report/:id" element={<InspectionReport />} />
        </Route>

        {/* Authentication & Onboarding */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-sent" element={<ForgotPasswordSent />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-link-invalid" element={<ResetLinkInvalid />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Company Registration & Portal */}
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/request-submitted" element={<RequestSubmitted />} />
        <Route element={<RequireRole roles={['Office']} />}>
          <Route element={<OfficeLayout />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/orders" element={<CompanyOrders />} />
            <Route path="/company/prices" element={<OfficePrices />} />
            <Route path="/company/schedule" element={<OfficeSchedule />} />
            <Route path="/company/engineers" element={<OfficeEngineers />} />
            <Route path="/company/engineers/add" element={<AddEngineer />} />
            <Route path="/company/info" element={<OfficeInfo />} />
          </Route>
          {/* old addresses */}
          <Route path="/company/profile" element={<Navigate to="/company/info" replace />} />
          <Route path="/company/add-engineer" element={<Navigate to="/company/engineers/add" replace />} />
        </Route>

        {/* Engineer Portal */}
        <Route element={<RequireRole roles={['Engineer']} />}>
          <Route element={<EngineerLayout />}>
            <Route path="/engineer/inspections" element={<EngineerInspections />} />
            <Route path="/engineer/write-report" element={<WriteReport />} />
            <Route path="/engineer/write-report/:id" element={<WriteReport />} />
            <Route path="/engineer/profile" element={<EngineerProfile />} />
          </Route>
        </Route>

        {/* Admin Portal */}
        <Route element={<RequireRole roles={['Admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/request/:id" element={<AdminRequestDetails />} />
            <Route path="/admin/offices" element={<AdminOffices />} />
            <Route path="/admin/audit-log" element={<AdminAuditLogPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
