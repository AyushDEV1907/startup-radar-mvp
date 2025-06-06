
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvestorDashboard from '@/pages/InvestorDashboard';
import InvestorPreferences from '@/pages/InvestorPreferences';
import InvestorCalibrate from '@/pages/InvestorCalibrate';
import InvestorSeedTest from '@/pages/InvestorSeedTest';
import Startups from '@/pages/Startups';
import StartupDetail from '@/pages/StartupDetail';
import NotFound from '@/pages/NotFound';

export default function InvestorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InvestorDashboard />} />
      <Route path="/dashboard" element={<InvestorDashboard />} />
      <Route path="/preferences" element={<InvestorPreferences />} />
      <Route path="/calibrate" element={<InvestorCalibrate />} />
      <Route path="/seed-test" element={<InvestorSeedTest />} />
      <Route path="/startups" element={<Startups />} />
      <Route path="/startups/:id" element={<StartupDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
