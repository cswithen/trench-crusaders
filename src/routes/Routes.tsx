import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/Login.js';
import Home from '../pages/Home.js';
import Campaigns from '../pages/Campaigns.js';
import CampaignDetails from '../pages/CampaignDetails.js';
import Warbands from '../pages/Warbands.js';
import Warband from '../pages/Warband';
import Profile from '../pages/Profile.js';
import PrivateRoute from './PrivateRoute.js';
import Navbar from '../components/Navbar/Navbar.js';

// Layout component with Navbar
function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/warbands" element={<Warbands />} />
        <Route path="/warbands/:id" element={<Warband />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
