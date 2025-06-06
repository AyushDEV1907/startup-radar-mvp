
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StartupDashboard from '@/pages/StartupDashboard';
import StartupRegister from '@/pages/StartupRegister';
import NotFound from '@/pages/NotFound';

export default function FounderRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartupDashboard />} />
      <Route path="/dashboard" element={<StartupDashboard />} />
      <Route path="/register" element={<StartupRegister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
