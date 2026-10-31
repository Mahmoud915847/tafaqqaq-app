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
import Login from './Pages/Login';
import SetPassword from './Pages/SetPassword';

// Company Portal Pages
import RegisterCompany from './Pages/company/RegisterCompany';
import RequestSubmitted from './Pages/company/RequestSubmitted';
import CompanyDashboard from './Pages/company/CompanyDashboard';
import CompanyOrders from './Pages/company/CompanyOrders';
import CompanyProfile from './Pages/company/CompanyProfile';
import AddEngineer from './Pages/company/AddEngineer';

// Engineer Portal Pages
import EngineerInspections from './Pages/engineer/EngineerInspections';
import WriteReport from './Pages/engineer/WriteReport';

// Admin Portal Pages
import AdminRequests from './Pages/admin/AdminRequests';
import AdminRequestDetails from './Pages/admin/AdminRequestDetails';
import AdminOffices from './Pages/admin/AdminOffices';

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
        <Route path="/book-inspection" element={<BookInspection />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/report/:id" element={<InspectionReport />} />

        {/* Authentication & Onboarding */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Company Registration & Portal */}
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/request-submitted" element={<RequestSubmitted />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/orders" element={<CompanyOrders />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/add-engineer" element={<AddEngineer />} />

        {/* Engineer Portal */}
        <Route path="/engineer/inspections" element={<EngineerInspections />} />
        <Route path="/engineer/write-report" element={<WriteReport />} />
        <Route path="/engineer/write-report/:id" element={<WriteReport />} />

        {/* Admin Portal */}
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/request/:id" element={<AdminRequestDetails />} />
        <Route path="/admin/offices" element={<AdminOffices />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;