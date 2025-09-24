import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import UsersPage from './pages/Dashboard/UsersPage';
import CollegeAuthPage from './pages/Dashboard/CollegeAuthPage';
import StoresPage from './pages/Dashboard/StoresPage';
import PartersPage from './pages/Dashboard/PartersPage';
import PartnershipsPage from './pages/Dashboard/PartnershipsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="college-auth" element={<CollegeAuthPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="partners" element={<PartersPage />} />
        <Route path="partnerships" element={<PartnershipsPage />} />
      </Route>
    </Routes>
  );
}
