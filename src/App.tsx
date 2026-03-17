/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import AuthConfirm from './pages/AuthConfirm';
import EmailConfirmation from './pages/EmailConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RegisterAccount from './pages/RegisterAccount';
import RegisterVehicle from './pages/RegisterVehicle';
import REGvehicleSUCCESS from './pages/REGvehicleSUCCESS';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordSuccess from './pages/ResetPasswordSuccess';
import Services from './pages/Services';
import Settings from './pages/Settings';
import VerifyOTP from './pages/VerifyOTP';
import Wallet from './pages/Wallet';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/reg" element={<RegisterAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/auth/confirm" element={<AuthConfirm />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/register" element={<RegisterVehicle />} />
            <Route path="/register-vehicle-success" element={<REGvehicleSUCCESS />} />
            <Route path="/services" element={<Services />} />
            <Route path="/wallet" element={<Wallet />} />

            <Route element={<Layout />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
